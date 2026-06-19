// app/ui/sales/sales-card.tsx
import { HiOutlineTrendingUp } from "react-icons/hi";

interface SalesCardProps {
    sales: number
}

export default function SalesCard({ sales }: SalesCardProps) {
    var total = 0; //Consultar ganancia total desde el backend
    const colorTotal = (total > 0) ? "text-emerald-500 bg-emerald-50" : 
                        (total < 0) ? "text-rose-500 bg-rose-50" :
                        "text-slate-500 bg-slate-50";

    return (
        <div className="flex flex-col bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex font-semibold text-sm text-slate-500 justify-between items-center mb-4">
                <span className="uppercase tracking-wider">Ventas</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <HiOutlineTrendingUp size={20} />
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800 tracking-tight">
                    {sales}
                </span>
            </div>
            {/* Si quisieras mostrar ganancias:
            <div className="mt-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorTotal}`}>
                    {total > 0 ? '+' : ''}{total}% desde el mes pasado
                </span>
            </div>
            */}
        </div>
    );
}