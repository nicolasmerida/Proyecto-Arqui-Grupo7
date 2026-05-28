// app/menu/page.tsx
import CourseInfo from "@/app/menu/course/[id]/page";
import Pagination from "@/app/ui/menu/pagination";
import { Plato } from "@/app/lib/definitions";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Menú',
};

type SearchParams = {
  page?: string;
}
interface MenuProps {
  searchParams?: SearchParams;
  editable?: boolean;
  selectionable?: boolean;
  addItem?: (plato: Plato, notas?: string) => void;
};

export default async function Menu({searchParams, editable=false, selectionable=false, addItem=(_plato: Plato, _notas?: string) => {} } : MenuProps) {
  const resolvedParams = searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const response = await fetch(`${process.env.BACKEND_URL}/api/menu?page=${currentPage-1}`);
  //Validar llamada al backend mediante fetch
  if (!response.ok) {
    throw new Error(`Eror ${response.status} al consultar el menú`);
  }

  const data: { content: Plato[]; totalPages: number } = await response.json();
  const items = data.content ?? [];  //Revisar nombre del parámetro para que coincida con backend
  const totalPages = data.totalPages;

  return (
    <main>  {/* Agregar margen superior segun Navbar */}
      <h1 className="flex flex-1 items-center">
        Bienvenido al menú de nuestro restaurante 🍽️
      </h1>
      <div className="flex flex-row">
        {/* Seleccionador de categoria para filtrar el menu */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {(items.length > 0) ?
          items.map((item) => (
            <div key={item.id} className="relative">
              <Link href={`/menu/course/${item.id}`}>
                <CourseInfo course={item} select={selectionable} edit={editable} addItem={addItem} />
              </Link>
            </div>
          ))
        : <p>No hay platos disponibles.</p>} {/* Revisar esta parte */}
      </div>
      <div className="justify-items-center mt-6">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </main>
  );
}