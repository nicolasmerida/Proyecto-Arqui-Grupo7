// app/ui/admin/FunctionsPanel.tsx
import Link from "next/link";
import { HiOutlineChartSquareBar, HiOutlineClipboardList, HiOutlineClock, HiOutlineCube, HiOutlineUserGroup } from "react-icons/hi";

export default function FunctionsPanel() {

    return (
        <aside className="fixed top-0 left-0 h-[calc(100vh-)] overflow-y-auto">  {/* Agregar margen superior segun Userbar y definir ancho de pnael */}
            <nav className="flex flex-col gap-4 rounded-lg" aria-label="Funciones del administrador">
                <Link href="/user/admin" className="flex gap-1 hover:underline">
                    <HiOutlineChartSquareBar className="text-lg" /> Estadísticas
                </Link>
                <Link href="/user/admin/menu" className="flex gap-1 hover:underline">
                    <HiOutlineClipboardList className="text-lg" /> Menú
                </Link>
                <Link href="/user/admin/stock" className="flex gap-1 hover:underline">
                    <HiOutlineCube className="text-lg" /> Stock
                </Link>
                <Link href="/user/admin/stock/movements" className="flex gap-1 hover:underline">
                    <HiOutlineClock className="text-lg" /> Movimientos
                </Link>
                <Link href="/user/admin/staff" className="flex gap-1 hover:underline">
                    <HiOutlineUserGroup className="text-lg" /> Usuarios
                </Link>
            </nav>
        </aside>
    );
}