// app/menu/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Pagination from "../ui/menu/pagination";
import CourseDetail from "../ui/menu/CourseDetail";

export const metadata: Metadata = {
  title: 'Menú',
};

type SearchParams = {
  page?: string;
}
type MenuProps = {
  searchParams?: SearchParams;
};

export default function Menu({searchParams} : MenuProps) {
  const resolvedParams = searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  let items;  //Items del menú. Consultar desde el backend
  let totalPages = 0; //Total de páginas disponible. Consultar desde el backend

  return (
    <main>
      <h1 className="flex flex-col flex-1 items-center justify-center">
        Bienvenido al menú de nuestro restaurante 🍽️
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {Array.isArray(items) ?
          items.map((item) => (
            <div key={item.id} className="relative">
              <Link href={`/menu/course/${item.id}`}>
                {/*Detalles del plato */}
                <CourseDetail course={item} />
              </Link>
            </div>
          ))
        : console.log("No hay platos")}
      </div>
      <div className="justify-items-center mt-6">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </main>
  );
}