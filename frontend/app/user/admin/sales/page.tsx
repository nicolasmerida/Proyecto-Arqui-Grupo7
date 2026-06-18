// app/user/admin/sales/page.tsx
import TableSales from "@/app/ui/sales/table-sales";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Ventas',
};

export default function Sales() {
    
    return (
        <>
            <div className="flex flex-col justify-start m-2">
                <span className="text-xl text-black font-serif">Ventas</span>
                <span className="text-sm text-gray-400">Historial de de comandas vendidas</span>
            </div>
            <div className="m-2">
                <TableSales />
            </div>
        </>
    );
}