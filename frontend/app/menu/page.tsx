'use client';
import MenuList from "@/app/ui/menu/MenuList";
import Pagination from "@/app/ui/menu/pagination";
import { Plato } from "@/app/lib/definitions";
import { useEffect, useState, use } from "react";
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  const isPublicMenu = pathname === '/menu';

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
<<<<<<< HEAD
    <main className={`flex-1 flex flex-col items-center px-4 w-full ${isPublicMenu ? 'pt-24 pb-12' : 'pt-6 pb-6'}`}>
      <div className={`w-full max-w-7xl bg-slate-50 shadow-2xl p-6 sm:p-10 border border-white/20 ${isPublicMenu ? 'rounded-[2rem]' : 'rounded-xl'}`}>

        {isPublicMenu && (
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 text-center mb-8 tracking-tight">
            Menú de nuestro Restaurante 🍽️
          </h1>
        )}

        <div className="w-full">
          <MenuList items={items} {...(addItem && { addItem })} />
        </div>

        <div className="flex justify-center mt-12">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
=======
    <main className="bg-[url('/bg_salon.jpeg')] bg-cover bg-center bg-fixed">  {/* Agregar margen superior segun Navbar */}
        <section className="text-center px-8 py-16 mb-8 max-w-4xl w-full bg-slate-700/75 rounded-2xl">
          <h1 className="flex flex-1 items-center text-amber-400 m-5">
            Bienvenido al menú de nuestro restaurante 🍽️
          </h1>
          <div className="px-5">
            <MenuList items={items} {...(addItem && { addItem })} />
          </div>
          <div className="justify-items-center mt-6">
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </div>
        </section>
>>>>>>> f4091dd2a37b03ec9350652e62b64a5b2dacd1e2
      </main>
      );
}