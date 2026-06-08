// app/user/admin/menu/page.tsx
import AdminMenuList from "@/app/ui/menu/AdminMenuList";
import Pagination from "@/app/ui/menu/pagination";
import { Plato } from "@/app/lib/definitions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Menú',
};

type SearchParams = {
  page?: string;
};
interface AdminProps {
  searchParams?: Promise<SearchParams>;
};

export default async function AdminMenu({ searchParams }: AdminProps) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menu?page=${currentPage - 1}`);
  if (!response.ok) {
    let errorMessage = `Error ${response.status} inesperado al consultar el menú`;
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

  const data: { content: Plato[]; totalPages: number } = await response.json();
  const items = data.content ?? [];
  const totalPages = data.totalPages;

  return (
    <main className="px-5 py-6">
      <h1 className="text-3xl font-semibold font-serif italic text-slate-900 mb-4">Administrar menú</h1>
      <p className="mb-6 text-slate-600">Aquí puedes editar los platos existentes o crear nuevos.</p>
      <AdminMenuList items={items} />
      <div className="mt-6">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </main>
  );
}