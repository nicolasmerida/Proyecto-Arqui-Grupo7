// app/ui/admin/FunctionsPanel.tsx
'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineChartSquareBar, HiOutlineClipboardList, HiOutlineClock, HiOutlineCube, HiOutlineUserGroup } from "react-icons/hi";

export default function FunctionsPanel() {
    const pathName = usePathname();

    return (
        <aside className="fixed top-16 left-0 h-screen overflow-y-auto w-36 border-r">  {/* Agregar margen superior segun Userbar y definir ancho de pnael */}
            <nav className="flex flex-col gap-4 rounded-lg mt-10 p-2" aria-label="Funciones del administrador">
                <Link href="/user/admin"
                    className={`flex gap-1 items-center hover:underline ${(pathName === "/user/admin" ? 'text-white font-semibold border border-black bg-black rounded-md' :'text-black' )}`}>
                    <HiOutlineChartSquareBar className="text-lg" /> Inicio
                </Link>
                <Link href="/user/admin/menu" 
                    className={`flex gap-1 items-center hover:underline ${(pathName.startsWith("/user/admin/menu") ? 'text-white font-semibold border border-black bg-black rounded-md' :'text-black')}`}>
                    <HiOutlineClipboardList className="text-lg" /> Menú
                </Link>
                <Link href="/user/admin/stock"
                    className={`flex gap-1 items-center hover:underline ${(pathName.startsWith("/user/admin/stock") ? 'text-white font-semibold border border-black bg-black rounded-md' :'text-black')}`}>
                    <HiOutlineCube className="text-lg" /> Stock
                </Link>
                <Link href="/user/admin/movements"
                    className={`flex gap-1 items-center hover:underline ${(pathName.startsWith("/user/admin/movements") ? 'text-white font-semibold border border-black bg-black rounded-md' :'text-black')}`}>
                    <HiOutlineClock className="text-lg" /> Movimientos
                </Link>
                <Link href="/user/admin/staff"
                    className={`flex gap-1 items-center hover:underline ${(pathName.startsWith("/user/admin/staff") ? 'text-white font-semibold border border-black bg-black rounded-md' :'text-black')}`}>
                    <HiOutlineUserGroup className="text-lg" /> Usuarios
                </Link>
            </nav>
        </aside>
    );
}