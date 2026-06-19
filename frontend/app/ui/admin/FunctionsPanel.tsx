// app/ui/admin/FunctionsPanel.tsx
'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineChartSquareBar, HiOutlineClipboardList, HiOutlineClock, HiOutlineCube, HiOutlineUserGroup } from "react-icons/hi";

export default function FunctionsPanel() {
    const pathName = usePathname();

    return (
        <aside className="fixed top-16 left-0 h-screen overflow-y-auto w-36 border-r">  {/* Agregar margen superior segun Userbar y definir ancho de pnael */}
            <nav className="flex flex-col bg-amber-400 gap-4 rounded-lg mt-10 p-2" aria-label="Funciones del administrador">
                <Link href="/user/admin"
                    className={`flex gap-1 items-center hover:underline ${(pathName === "/user/admin" ? 'text-amber-200 font-semibold border border-orange-500 bg-amber-600 rounded-md' :'text-amber-600')}`}>
                    <HiOutlineChartSquareBar className={`text-lg ${(pathName === "/user/admin" ? 'text-blue-400 font-semibold bg-slate-500' :'text-slate-500')}`} /> Inicio
                </Link>
                <Link href="/user/admin/menu" 
                    className={`flex gap-1 items-center hover:underline ${(pathName.startsWith("/user/admin/menu") ? 'text-amber-200 font-semibold border border-orange-500 bg-amber-600 rounded-md' :'text-amber-600')}`}>
                    <HiOutlineClipboardList className={`text-lg ${(pathName === "/user/admin" ? 'text-amber-200 font-semibold bg-amber-600' :'text-amber-600')}`} /> Menú
                </Link>
                <Link href="/user/admin/stock"
                    className={`flex gap-1 items-center hover:underline ${(pathName.startsWith("/user/admin/stock") ? 'text-amber-200 font-semibold border border-orange-500 bg-amber-600 rounded-md' :'text-amber-600')}`}>
                    <HiOutlineCube className={`text-lg ${(pathName === "/user/admin" ? 'text-amber-200 font-semibold bg-amber-600' :'text-amber-600')}`} /> Stock
                </Link>
                <Link href="/user/admin/movements"
                    className={`flex gap-1 items-center hover:underline ${(pathName.startsWith("/user/admin/movements") ? 'text-amber-200 font-semibold border border-orange-500 bg-amber-600 rounded-md' :'text-amber-600')}`}>
                    <HiOutlineClock className={`text-lg ${(pathName === "/user/admin" ? 'text-amber-200 font-semibold bg-amber-600' :'text-amber-600')}`} /> Movimientos
                </Link>
                <Link href="/user/admin/staff"
                    className={`flex gap-1 items-center hover:underline ${(pathName.startsWith("/user/admin/staff") ? 'text-amber-200 font-semibold border border-orange-500 bg-amber-600 rounded-md' :'text-amber-600')}`}>
                    <HiOutlineUserGroup className={`text-lg ${(pathName === "/user/admin" ? 'text-amber-200 font-semibold bg-amber-600' :'text-amber-600')}`} /> Usuarios
                </Link>
            </nav>
        </aside>
    );
}