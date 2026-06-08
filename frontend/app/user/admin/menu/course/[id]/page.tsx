// app/user/admin/menu/course/[id]/page.tsx
import AddCourseForm from '@/app/ui/forms/AddCourseForm';
import { Plato } from '@/app/lib/definitions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Editar plato',
};

interface CourseEditPageProps {
  params: { id: string };
}

async function fetchCourse(id: string): Promise<Plato> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/platos/${id}`);
  if (!response.ok) {
    let errorMessage = `Error ${response.status} inesperado al consultar un plato del menú`;
    let errorCode = `ERROR_DESCONOCIDO`;
    try {
      //Intento obtener el mensaje de error desde la API
      const errorData = await response.json();
      if (errorData?.error?.message) {
        errorMessage = errorData.error.message;
        errorCode = errorData.error.code || errorCode;
      }
    }
    catch (e) {
      //Se mantiene el mensaje de error por defecto
    }
    //Lanzo el error
    throw new Error(errorMessage, { cause: errorCode });
  }

  //Si no se encuentra el plato elegido
  if (response.status === 404) {
    notFound();
  }

  return response.json();
}

export default async function CourseEditPage({ params }: CourseEditPageProps) {
  const course = await fetchCourse(params.id);

  return (
    <main className="px-5 py-6">
      <AddCourseForm course={course} />
    </main>
  );
}