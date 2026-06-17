// app/ui/forms/AddCourseForm.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Ingrediente, Plato, Receta } from '@/app/lib/definitions';
import { HiOutlineArrowSmLeft, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';

const CATEGORY_OPTIONS = Object.values(Category) as Category[];

interface AddCourseFormProps {
  course?: Plato;
}

export default function AddCourseForm({ course }: AddCourseFormProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(0);
  const [categoria, setCategoria] = useState<Category>(Category.Entrada);

  // Receta state
  const [availableIngredientes, setAvailableIngredientes] = useState<Ingrediente[]>([]);
  const [recetaOriginal, setRecetaOriginal] = useState<Receta[]>([]);
  const [receta, setReceta] = useState<{ ingrediente: Ingrediente, cantidad: number }[]>([]);
  const [selectedIngredienteId, setSelectedIngredienteId] = useState<number | ''>('');
  const [ingredienteCantidad, setIngredienteCantidad] = useState<number>(1);

  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Load course details
  useEffect(() => {
    if (!course) {
      setNombre('');
      setDescripcion('');
      setPrecio(0);
      setCategoria(Category.Principal);
      return;
    }

    setNombre(course.nombre);
    setDescripcion(course.descripcion);
    setPrecio(course.precio);
    setCategoria(course.categoria.nombre);
  }, [course]);

  // Load available ingredients
  useEffect(() => {
    const fetchIngredientes = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ingredientes`);
        if (response.ok) {
          const data = await response.json();
          setAvailableIngredientes(data);
        }
      } catch (error) {
        console.error("Error al cargar ingredientes", error);
      }
    };
    fetchIngredientes();
  }, []);

  // Load existing recipe if editing
  useEffect(() => {
    const fetchReceta = async () => {
      if (!course?.idPlato) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recetas/plato/${course.idPlato}`);
        if (response.ok) {
          const data: Receta[] = await response.json();
          setRecetaOriginal(data);
          setReceta(data.map(r => ({ ingrediente: r.ingrediente, cantidad: r.cantidad })));
        }
      } catch (error) {
        console.error("Error al cargar la receta", error);
      }
    };
    fetchReceta();
  }, [course]);

  const handleAddIngrediente = () => {
    if (selectedIngredienteId === '' || ingredienteCantidad <= 0) return;

    const id = Number(selectedIngredienteId);
    // Verificar si ya está en la receta
    if (receta.some(r => r.ingrediente.idIngrediente === id)) {
      alert("Este ingrediente ya está en la receta.");
      return;
    }

    const ingrediente = availableIngredientes.find(i => i.idIngrediente === id);
    if (ingrediente) {
      setReceta([...receta, { ingrediente, cantidad: ingredienteCantidad }]);
      setSelectedIngredienteId('');
      setIngredienteCantidad(1);
    }
  };

  const handleRemoveIngrediente = (id: number) => {
    setReceta(receta.filter(r => r.ingrediente.idIngrediente !== id));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nombre.trim() || !descripcion.trim() || precio <= 0) {
      alert('Complete nombre, descripción y precio válido.');
      return;
    }

    if (receta.length === 0) {
      alert('El plato debe tener al menos un ingrediente en la receta para poder ser pedido desde una comanda.');
      return;
    }

    setSaving(true);
    const categoryOption = CATEGORY_OPTIONS.find((option) => option === categoria);
    const categoriaId = categoryOption ? CATEGORY_OPTIONS.indexOf(categoryOption) + 1 : undefined;

    try {
      const payload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio,
        categoria: categoria, // Enviar como String según PlatoDTO
        activo: course ? course.activo : true,
      };

      const endpoint = course?.idPlato
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/platos/${course.idPlato}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/platos`;
      const method = course?.idPlato ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status} inesperado al agregar o editar un plato del menú`;
        let errorCode = `ERROR_DESCONOCIDO`;
        try {
          const errorData = await response.json();
          if (errorData?.error?.message) {
            errorMessage = errorData.error.message;
            errorCode = errorData.error.code || errorCode;
          }
        } catch (e) { }
        throw new Error(errorMessage, { cause: errorCode });
      }

      const savedCourse = await response.json();
      const idPlato = savedCourse.idPlato;

      // Procesar la receta
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      // 1. Encontrar ingredientes eliminados y borrarlos
      if (course?.idPlato) {
        for (const rOrig of recetaOriginal) {
          const stillExists = receta.some(r => r.ingrediente.idIngrediente === rOrig.ingrediente.idIngrediente);
          if (!stillExists) {
            await fetch(`${backendUrl}/api/recetas`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idPlato, idIngrediente: rOrig.ingrediente.idIngrediente })
            });
          }
        }
      }

      // 2. Hacer POST para crear o actualizar (upsert) todos los ingredientes actuales
      for (const item of receta) {
        await fetch(`${backendUrl}/api/recetas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: { idPlato, idIngrediente: item.ingrediente.idIngrediente },
            plato: { idPlato },
            ingrediente: { idIngrediente: item.ingrediente.idIngrediente },
            cantidad: item.cantidad
          })
        });
      }

      router.push('/user/admin/menu');
    }
    catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert(`No se pudo guardar el plato: ${error.message}`);
      } else {
        alert('No se pudo guardar el plato, intente nuevamente.');
      }
    }
    finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-start gap-4">
        <button type="button" onClick={() => router.back()}
          className="items-center gap-2 rounded-xl px-4 py-2 bg-amber-200 border border-black text-slate-500 transition hover:text-black hover:bg-slate-500">
          <HiOutlineArrowSmLeft />
          <span>Volver</span>
        </button>
        <span className="text-2xl font-serif italic text-black ">
          Completa los datos del plato para {course?.idPlato ? 'editar plato' : 'crear un nuevo plato'}.
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-6">

        {/* Basic Details Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Información Básica</h3>

          <label className="block space-y-2 text-sm font-medium text-slate-700">
            Nombre del plato
            <input
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
              placeholder="Ej: Ensalada caprese"
              required
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-slate-700">
            Descripción
            <textarea
              value={descripcion}
              onChange={(event) => setDescripcion(event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none resize-none"
              placeholder="Ej: Tomate, mozzarella, albahaca y un toque de oliva"
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Precio
              <input
                type="number"
                min={0}
                step={5.00}
                value={precio}
                onChange={(event) => setPrecio(Number(event.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                required
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Categoría
              <select
                value={categoria}
                onChange={(event) => setCategoria(event.target.value as Category)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                required
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {/* Receta Section */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Receta / Ingredientes</h3>
          <p className="text-xs text-slate-500">Añade los ingredientes y las cantidades necesarias para preparar este plato. Esto se descontará del stock automáticamente cada vez que se pida.</p>

          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <label className="flex-1 space-y-2 text-sm font-medium text-slate-700">
              Ingrediente
              <select
                value={selectedIngredienteId}
                onChange={(e) => setSelectedIngredienteId(e.target.value ? Number(e.target.value) : '')}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="">-- Seleccionar Ingrediente --</option>
                {availableIngredientes.map(ing => (
                  <option key={ing.idIngrediente} value={ing.idIngrediente}>
                    {ing.nombre} ({ing.unidad})
                  </option>
                ))}
              </select>
            </label>
            <label className="w-full sm:w-32 space-y-2 text-sm font-medium text-slate-700">
              Cantidad
              <input
                type="number"
                min={1}
                step={0.1}
                value={ingredienteCantidad}
                onChange={(e) => setIngredienteCantidad(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </label>
            <button
              type="button"
              onClick={handleAddIngrediente}
              disabled={selectedIngredienteId === ''}
              className="h-[42px] px-4 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <HiOutlinePlus /> Añadir
            </button>
          </div>

          <div className="mt-4 border rounded-xl overflow-hidden bg-white">
            {receta.length === 0 ? (
              <div className="p-4 text-center text-slate-500 italic text-sm">
                Aún no hay ingredientes agregados a la receta.
              </div>
            ) : (
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="bg-slate-100 text-slate-700 uppercase">
                  <tr>
                    <th className="px-4 py-3">Ingrediente</th>
                    <th className="px-4 py-3">Unidad</th>
                    <th className="px-4 py-3 text-right">Cantidad</th>
                    <th className="px-4 py-3 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {receta.map((item) => (
                    <tr key={item.ingrediente.idIngrediente} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{item.ingrediente.nombre}</td>
                      <td className="px-4 py-3">{item.ingrediente.unidad}</td>
                      <td className="px-4 py-3 text-right">{item.cantidad}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveIngrediente(item.ingrediente.idIngrediente)}
                          className="text-red-500 hover:text-red-700 transition"
                          title="Remover"
                        >
                          <HiOutlineTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex flex-col gap-3 sm:flex-row mt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center rounded-xl bg-green-500 px-6 py-3 text-white font-bold transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Guardando...' : 'Guardar Plato'}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => router.push('/user/admin/menu')}
            className="inline-flex justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-slate-700 font-bold transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}