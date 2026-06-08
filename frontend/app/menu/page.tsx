// app/menu/page.tsx
import MenuList from "@/app/ui/menu/MenuList";
import Pagination from "@/app/ui/menu/pagination";
import { Plato } from "@/app/lib/definitions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Menú',
};

type SearchParams = {
  page?: string;
}
interface MenuProps {
  searchParams?: Promise<SearchParams>;
  addItem?: (plato: Plato, notas?: string) => void;
};

export default async function Menu({ searchParams, addItem }: MenuProps) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menu?page=${currentPage-1}`);
  //const response = await fetch(`${process.env.BACKEND_URL}/api/menu?page=${currentPage-1}`);
  //Validar llamada al backend mediante fetch

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
  const items = data.content ?? [];  //Revisar nombre del parámetro para que coincida con backend
  const totalPages = data.totalPages;

  return (
    <main>  {/* Agregar margen superior segun Navbar */}
      <h1 className="flex flex-1 items-center m-5">
        Bienvenido al menú de nuestro restaurante 🍽️
      </h1>
      <div className="px-5">
        <MenuList items={items} {...(addItem && { addItem })} />
      </div>
      <div className="justify-items-center mt-6">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </main>
  );
}