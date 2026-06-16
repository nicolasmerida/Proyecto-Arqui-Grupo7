'use client';
import MenuList from "@/app/ui/menu/MenuList";
import Pagination from "@/app/ui/menu/pagination";
import { Plato } from "@/app/lib/definitions";
import { useEffect, useState, use } from "react";

// metadata eliminada para permitir importación desde client components

type SearchParams = {
  page?: string;
}
interface MenuProps {
  searchParams?: Promise<SearchParams>;
  addItem?: (plato: Plato, notas?: string) => void;
};

export default function Menu({ searchParams, addItem }: MenuProps) {
  const params = searchParams ? use(searchParams) : undefined;
  const currentPage = Number(params?.page) || 1;
  const [data, setData] = useState<{ content: Plato[], totalPages: number }>({ content: [], totalPages: 1 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        const response = await fetch(`${baseUrl}/api/menu?page=${currentPage - 1}`);

        if (!response.ok) {
          throw new Error(`Error al consultar el menú`);
        }

        const result = await response.json();
        setData(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocurrió un error inesperado al cargar el menú");
        }
      }
    };

    fetchMenu();
  }, [currentPage]);

  if (error) {
    return <div className="text-red-500 m-5">Error: {error}</div>;
  }

  const items = data.content ?? [];
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