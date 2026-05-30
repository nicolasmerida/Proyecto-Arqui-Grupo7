// app/user/admin/stock/page.tsx
import TableStock from "@/app/ui/stock/table-stock";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Stock',
};

export default function Stock() {

    return (
        <>
        <div className="flex flex-col">
            <span className="font-serif text-black">Stock</span>
            <span className="text-gray-400">Inventario de ingredientes e insumos</span>
        </div>
        <TableStock />
        </>
    );
}