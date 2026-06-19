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
    
    // El backend puede enviar categoria como un string ("PRINCIPAL") o como un objeto { nombre: "PRINCIPAL" }
    const categoriaName = typeof course.categoria === 'string' 
      ? course.categoria 
      : (course.categoria as any)?.nombre;
      
    if (categoriaName) {
      setCategoria(categoriaName as Category);
    }
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
          className="items-center gap-2 rounded-xl px-4 py-2 bg-amber-200 border border-orange-400 text-amber-400 transition hover:text-amber-600 hover:bg-amber-300">
          <HiOutlineArrowSmLeft className='text-lg text-amber-400' />
          <span>Volver</span>
        </button>
        <span className="text-2xl font-serif italic text-amber-400">
          Completa los datos del plato para {course?.idPlato ? 'editar plato' : 'crear un nuevo plato'}.
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-6">

        {/* Basic Details Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Información Básica</h3>

          <label className="block space-y-2 text-sm font-medium text-amber-400">
            Nombre del plato
            <input
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              className="w-full rounded-xl border border-amber-300 text-amber-400 focus:border-yellow-400 px-3 py-2 focus:outline-none resize-none"
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
              className="w-full rounded-xl border border-amber-300 text-amber-400 focus:border-yellow-400 px-3 py-2 focus:outline-none resize-none"
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
                className="w-full rounded-xl border border-amber-300 text-amber-400 focus:border-yellow-400 px-3 py-2 focus:outline-none resize-none"
                required
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Categoría
              <select
                value={categoria}
                onChange={(event) => setCategoria(event.target.value as Category)}
                className="w-full rounded-xl border border-amber-300 text-amber-400 focus:border-yellow-400 px-3 py-2 focus:outline-none resize-none"
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
        <div className="bg-linear-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200 shadow-inner space-y-5">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Receta / Ingredientes</h3>
            <p className="text-sm text-slate-500 mt-1">Añade los ingredientes necesarios para preparar este plato. El stock se descontará automáticamente.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <label className="flex-1 space-y-1.5 text-sm font-semibold text-slate-700 w-full">
              Seleccionar Ingrediente
              <select
                value={selectedIngredienteId}
                onChange={(e) => setSelectedIngredienteId(e.target.value ? Number(e.target.value) : '')}
                className="w-full rounded-xl border border-amber-300 text-amber-400 focus:border-yellow-400 px-3 py-2 focus:outline-none resize-none"
              >
                <option value="">-- Buscar ingrediente --</option>
                {availableIngredientes.map(ing => (
                  <option key={ing.idIngrediente} value={ing.idIngrediente}>
                    {ing.nombre} ({ing.unidad})
                  </option>
                ))}
              </select>
            </label>
            <label className="w-full sm:w-32 space-y-1.5 text-sm font-semibold text-slate-700">
              Cantidad
              <input
                type="number"
                min={1}
                step={0.1}
                value={ingredienteCantidad}
                onChange={(e) => setIngredienteCantidad(Number(e.target.value))}
                className="w-full rounded-xl border border-amber-300 text-amber-400 focus:border-yellow-400 px-3 py-2 focus:outline-none resize-none transition-all outline-none"
              />
            </label>
            <button
              type="button"
              onClick={handleAddIngrediente}
              disabled={selectedIngredienteId === ''}
              className="flex items-center justify-center h-11 px-4 bg-amber-400 text-white rounded-xl hover:bg-amber-600 border border-orange-400 transition gap-2 disabled:opacity-50"
            >
              <HiOutlinePlus className='text-white text-lg'/> Añadir
            </button>
          </div>

          <div className="mt-4 border rounded-xl overflow-hidden bg-white">
            {receta.length === 0 ? (
              <div className="p-8 flex flex-col items-center justify-center bg-white rounded-xl border-2 border-dashed border-slate-300">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl text-slate-300">🍲</span>
                </div>
                <span className="text-slate-500 font-medium">Aún no hay ingredientes agregados</span>
                <span className="text-slate-400 text-sm">¡Comenzá a armar la receta para este plato!</span>
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
                  <div 
                    key={item.ingrediente.idIngrediente} 
                    className="group flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-bold shadow-inner">
                        {item.ingrediente.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-base">{item.ingrediente.nombre}</span>
                        <span className="text-xs text-slate-500 font-medium tracking-wide uppercase">Ingrediente Base</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                      <div className="bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">
                        <span className="font-bold text-slate-700">{item.cantidad}</span>
                        <span className="text-slate-500 ml-1 font-medium">{item.ingrediente.unidad}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngrediente(item.ingrediente.idIngrediente)}
                        className="text-slate-400 bg-white border border-slate-200 hover:text-white hover:bg-red-500 hover:border-red-500 p-2 rounded-lg transition-colors focus:outline-none"
                        title="Remover ingrediente"
                      >
                        <HiOutlineTrash size={20} />
                      </button>
                    </div>
                  </div>
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
            className="inline-flex justify-center rounded-xl bg-amber-300 px-6 py-3 text-white font-bold transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
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