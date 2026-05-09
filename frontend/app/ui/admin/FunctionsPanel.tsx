// app/ui/admin/FunctionsPanel.tsx
import Link from "next/link";
import { HiOutlineChartSquareBar, HiOutlineClipboardList, HiOutlineClock, HiOutlineCube, HiOutlineUserGroup } from "react-icons/hi";

export default function FunctionsPanel() {

    return (
        <nav className="flex flex-col gap-2">
            <Link href="/user/admin">
                <HiOutlineChartSquareBar /> Estadísticas
            </Link>
            <Link href="/user/admin">
                <HiOutlineCube /> Stock
            </Link>
            <Link href="/user/admin">
                <HiOutlineClipboardList /> Menú
            </Link>
            <Link href="/user/admin">
                <HiOutlineClock /> Movimientos
            </Link>
            <Link href="/user/admin">
                <HiOutlineUserGroup /> Usuarios
            </Link>
        </nav>
    );
}