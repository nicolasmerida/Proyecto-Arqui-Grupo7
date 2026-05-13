// app/ui/admin/FunctionsPanel.tsx
import Link from "next/link";
import { HiOutlineChartSquareBar, HiOutlineClipboardList, HiOutlineClock, HiOutlineCube, HiOutlineUserGroup } from "react-icons/hi";

export default function FunctionsPanel() {

    return (
        <nav className="flex flex-col rounded-lg gap-2">
            <Link href="/user/admin" className="flex gap-1 hover:underline">
                <HiOutlineChartSquareBar /> Estadísticas
            </Link>
            <Link href="/user/admin/menu" className="flex gap-1 hover:underline">
                <HiOutlineClipboardList /> Menú
            </Link>
            <Link href="/user/admin/stock" className="flex gap-1 hover:underline">
                <HiOutlineCube /> Stock
            </Link>
            <Link href="/user/admin/stock/movements" className="flex gap-1 hover:underline">
                <HiOutlineClock /> Movimientos
            </Link>
            <Link href="/user/admin/staff" className="flex gap-1 hover:underline">
                <HiOutlineUserGroup /> Usuarios
            </Link>
        </nav>
    );
}