// app/ui/admin/StatsBar.tsx
import Link from "next/link";
import { HiOutlineCash, HiOutlineCube, HiOutlineDocumentDuplicate, HiOutlineHome, HiOutlineTrendingUp, HiOutlineUserGroup } from "react-icons/hi";

export default function StatsBar() {

    return (
        <div className="flex flex-row gap-1">
            <Link href="/user/admin" className="justify-between">
                Inicio <HiOutlineHome />
            </Link>
            <Link href="/user/admin/stock" className="justify-between">
                Stock <HiOutlineCube />
            </Link>
            <Link href="/user/admin/sales" className="justify-between">
                Ventas <HiOutlineTrendingUp />
            </Link>
            <Link href="/user/admin/commands" className="justify-between">
                Comandas <HiOutlineDocumentDuplicate />
            </Link>
            <Link href="/user/admin/tickets" className="justify-between">
                Ticket promedio <HiOutlineCash />
            </Link>
            <Link href="/user/admin/staff" className="justify-between">
                Mozos activos <HiOutlineUserGroup />
            </Link>
        </div>
    );
}