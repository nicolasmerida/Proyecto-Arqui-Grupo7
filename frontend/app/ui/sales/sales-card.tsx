// app/ui/sales/sales-card.tsx
import { HiOutlineTrendingUp } from "react-icons/hi";

interface SalesCardProps {
    sales: number
}

export default function SalesCard({ sales }: SalesCardProps) {
    var total = 0; //Consultar ganancia total desde el backend
    const colorTotal = (total > 0) ? "text-green-500" : 
                        (total < 0) ? "text-red-500" :
                        "text-black";

    return (
        <div className="flex flex-col border">
            <div className="flex font-semibold text-base text-gray-400 justify-between">
                Ventas <HiOutlineTrendingUp />
            </div>
            <div className="flex text-xl colorTotal font-serif">
                {/* Ganancia total ventas
                    Si total es > a 0, color verde
                    Si total es = a 0, color negro
                    Si total es < a 0, color rojo  */}
            </div>
        </div>
    );
}