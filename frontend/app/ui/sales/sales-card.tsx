// app/ui/sales/sales-card.tsx
import { HiOutlineTrendingUp } from "react-icons/hi";

interface SalesCardProps {
    sales: number
}

export default function SalesCard({ sales }: SalesCardProps) {
    const total = sales; // Usamos el valor real del backend
    const colorTotal = (total > 0) ? "text-green-500" : 
                        (total < 0) ? "text-red-500" :
                        "text-black";

    return (
        <div className="flex flex-col border p-4 rounded-md shadow-sm bg-white min-w-[200px]">
            <div className="flex font-semibold text-base text-gray-400 justify-between items-center mb-2">
                <span>Ventas</span>
                <HiOutlineTrendingUp className="text-xl" />
            </div>
            <div className={`flex text-3xl font-bold font-serif ${colorTotal}`}>
                ${total.toLocaleString('es-AR')}
            </div>
        </div>
    );
}