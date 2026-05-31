// app/user/admin/movements/page.tsx
import TableMovements from "@/app/ui/stock/table-movements";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Stock',
};

export default function Movements() {

    return (
        <>
        <div className="flex flex-col justify-start items-center m-2">
            <span className="text-xl text-black font-serif">Movimientos de stock</span>
            <span className="text-sm text-gray-400">Historial de ingresos y consumos</span>
        </div>
        <TableMovements />
        </>
    );
}