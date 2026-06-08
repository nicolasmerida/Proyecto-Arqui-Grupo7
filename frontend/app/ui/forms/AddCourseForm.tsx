// app/ui/forms/AddCourseForm.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Plato } from '@/app/lib/definitions';
import { HiOutlineArrowSmLeft } from 'react-icons/hi';

const CATEGORY_OPTIONS = Object.values(Category) as Category[];

interface AddCourseFormProps {
  course?: Plato;
}

export default function AddCourseForm({ course }: AddCourseFormProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState(0);
  const [categoria, setCategoria] = useState<Category>(Category.Entrada);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nombre.trim() || !descripcion.trim() || precio <= 0) {
      alert('Complete nombre, descripción y precio válido.');
      return;
    }

    setSaving(true);
    const categoryOption = CATEGORY_OPTIONS.find((option) => option === categoria);
    const categoriaId = categoryOption ? CATEGORY_OPTIONS.indexOf(categoryOption) + 1 : undefined;
    //Enviar detalles de nuevo plato al backend
    try {
      const payload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio,
        categoria: {
          id: categoriaId,
          nombre: categoria,
        },
      };

      const endpoint = course?.id
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/platos/${course.id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/platos`;
      const method = course?.id ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status} inesperado al guardar el plato.`;
        try {
          const errorData = await response.json();
          if (errorData?.error?.message) errorMessage = errorData.error.message;
        } catch {
          // ignore
        }
        throw new Error(errorMessage);
      }

      router.push('/user/admin/menu');
    } catch (error) {
      console.error(error);
      alert('No se pudo guardar el plato, intente nuevamente.');
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
          Completa los datos del plato para {course?.id ? 'editar plato' : 'crear un nuevo plato'}.
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Nombre del plato
          <input
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
            placeholder="Ej: Ensalada caprese"
            required
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          Descripción
          <textarea
            value={descripcion}
            onChange={(event) => setDescripcion(event.target.value)}
            rows={4}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none resize-none"
            placeholder="Ej: Tomate, mozzarella, albahaca y un toque de oliva"
          />
        </label>

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

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center rounded-xl bg-green-400 px-4 py-2 text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/user/admin/menu')}
            className="inline-flex justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}