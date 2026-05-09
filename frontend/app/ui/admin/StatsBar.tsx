// app/ui/admin/StatsBar.tsx
import Link from "next/link";
import { HiOutlineCash, HiOutlineDocumentDuplicate, HiOutlineTrendingUp, HiOutlineUserGroup } from "react-icons/hi";

export default function StatsBar() {

    return (
        <div className="flex flex-row gap-1">
            <Link href="/user/admin" className="justify-between">
                Ventas <HiOutlineTrendingUp />
            </Link>
            <Link href="/user/admin" className="justify-between">
                Comandas <HiOutlineDocumentDuplicate />
            </Link>
            <Link href="/user/admin" className="justify-between">
                Ticket promedio <HiOutlineCash />
            </Link>
            <Link href="/user/admin" className="justify-between">
                Mozos activos <HiOutlineUserGroup />
            </Link>
        </div>
    );
}