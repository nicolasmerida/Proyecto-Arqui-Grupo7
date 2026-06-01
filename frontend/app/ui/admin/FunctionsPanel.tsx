// app/ui/admin/FunctionsPanel.tsx
'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineChartSquareBar, HiOutlineClipboardList, HiOutlineClock, HiOutlineCube, HiOutlineUserGroup } from "react-icons/hi";

export default function FunctionsPanel() {
    const pathName = usePathname();

    return (
        <aside className="fixed top-0 left-0 h-screen overflow-y-auto w-28 pt-20">  {/* Agregar margen superior segun Userbar y definir ancho de pnael */}
            <nav className="flex flex-col gap-4 rounded-lg" aria-label="Funciones del administrador">
                <Link href="/user/admin" className={`flex gap-1 hover:underline ${(pathName === "/user/admin" ? 'text-white font-semibold' :'text-black' )}`}>
                    <HiOutlineChartSquareBar className="text-lg" /> Inicio
                </Link>
                <Link href="/user/admin/menu" 
                    className={`flex gap-1 hover:underline ${(pathName.startsWith("/user/admin/menu") ? 'text-white font-semibold' :'text-black')}`}>
                    <HiOutlineClipboardList className="text-lg" /> Menú
                </Link>
                <Link href="/user/admin/stock"
                    className={`flex gap-1 hover:underline ${(pathName.startsWith("/user/admin/stock") ? 'text-white font-semibold' :'text-black')}`}>
                    <HiOutlineCube className="text-lg" /> Stock
                </Link>
                <Link href="/user/admin/movements"
                    className={`flex gap-1 hover:underline ${(pathName.startsWith("/user/admin/movements") ? 'text-white font-semibold' :'text-black')}`}>
                    <HiOutlineClock className="text-lg" /> Movimientos
                </Link>
                <Link href="/user/admin/staff"
                    className={`flex gap-1 hover:underline ${(pathName.startsWith("/user/admin/staff") ? 'text-white font-semibold' :'text-black')}`}>
                    <HiOutlineUserGroup className="text-lg" /> Usuarios
                </Link>
            </nav>
        </aside>
    );
}