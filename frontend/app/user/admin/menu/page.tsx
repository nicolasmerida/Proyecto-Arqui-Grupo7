// app/user/admin/menu/page.tsx
import AdminMenuList from "@/app/ui/menu/AdminMenuList";
import Pagination from "@/app/ui/menu/pagination";
import { Plato } from "@/app/lib/definitions";
import { Metadata } from "next";
import ExportarGoogleSheets from "@/app/ui/admin/ExportarGoogleSheets";

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
    <div className="min-h-screen bg-slate-50/50 pb-10">
      {/* Header Premium */}
      <div className="bg-white border-b border-slate-200 px-8 py-8 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-serif italic text-slate-900">Administrar Menú</h1>
          <p className="text-slate-500 mt-1 font-medium">Aquí puedes editar los platos existentes o crear nuevos.</p>
        </div>
        <div>
          <ExportarGoogleSheets />
        </div>
      </div>

      <main className="px-8 py-6 max-w-7xl mx-auto space-y-6">
        <AdminMenuList items={items} />
        <div className="mt-6 flex justify-center">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </main>
    </div>
  );
}