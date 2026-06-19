// app/ui/admin/FunctionsPanel.tsx
'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineChartSquareBar, HiOutlineClipboardList, HiOutlineClock, HiOutlineCube, HiOutlineUserGroup } from "react-icons/hi";

export default function FunctionsPanel() {
    const pathName = usePathname();

    return (
        <aside className="fixed top-16 left-0 h-screen overflow-y-auto w-36 border-r">  {/* Agregar margen superior segun Userbar y definir ancho de pnael */}
            <nav className="flex flex-col bg-sky-500 gap-4 rounded-lg mt-10 p-2" aria-label="Funciones del administrador">
                <Link href="/user/admin"
                    className={`flex gap-1 items-center hover:underline ${(pathName === "/user/admin" ? 'text-blue-400 font-semibold border border-slate-500 bg-slate-700 rounded-md' :'text-slate-700')}`}>
                    <HiOutlineChartSquareBar className="text-lg" /> Inicio
                </Link>
                <Link href="/user/admin/menu" 
                    className={`flex gap-1 items-center hover:underline ${(pathName.startsWith("/user/admin/menu") ? 'text-blue-400 font-semibold border border-slate-700 bg-slate-500 rounded-md' :'text-slate-700')}`}>
                    <HiOutlineClipboardList className="text-lg" /> Menú
                </Link>
                <Link href="/user/admin/stock"
                    className={`flex gap-1 items-center hover:underline ${(pathName.startsWith("/user/admin/stock") ? 'text-blue-400 font-semibold border border-slate-700 bg-slate-500 rounded-md' :'text-slate-700')}`}>
                    <HiOutlineCube className="text-lg" /> Stock
                </Link>
                <Link href="/user/admin/movements"
                    className={`flex gap-1 items-center hover:underline ${(pathName.startsWith("/user/admin/movements") ? 'text-blue-400 font-semibold border border-slate-700 bg-slate-500 rounded-md' :'text-slate-700')}`}>
                    <HiOutlineClock className="text-lg" /> Movimientos
                </Link>
                <Link href="/user/admin/staff"
                    className={`flex gap-1 items-center hover:underline ${(pathName.startsWith("/user/admin/staff") ? 'text-blue-400 font-semibold border border-slate-700 bg-slate-500 rounded-md' :'text-slate-700')}`}>
                    <HiOutlineUserGroup className="text-lg" /> Usuarios
                </Link>
            </nav>
        </aside>
    );
}