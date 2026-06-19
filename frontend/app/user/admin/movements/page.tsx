// app/user/admin/movements/page.tsx
import TableMovements from "@/app/ui/stock/table-movements";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Movimientos de Stock',
};

export default function Movements() {
    return (
        <div className="min-h-screen bg-slate-50/50 pb-10">
            {/* Header Premium */}
            <div className="bg-white border-b border-slate-200 px-8 py-8 shadow-sm">
                <h1 className="text-3xl font-bold font-serif italic text-slate-900">Historial de Movimientos</h1>
                <p className="text-slate-500 mt-1">Registro de ingresos y consumos de inventario</p>
            </div>

            <main className="px-8 py-6 max-w-7xl mx-auto space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1">
                    <TableMovements />
                </div>
            </main>
        </div>
    );
}