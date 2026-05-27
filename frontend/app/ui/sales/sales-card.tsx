// app/ui/sales/sales-card.tsx
import { HiOutlineTrendingUp } from "react-icons/hi";

export default function SalesCard() {

    return (
        <div className="flex flex-col border">
            <div className="flex font-semibold text-base text-gray-400 justify-between">
                Ventas <HiOutlineTrendingUp />
            </div>
            <div className="flex text-xl text-green-500 font-serif">
                {/* Ganancia total ventas
                    Si total es > a 0, color verde
                    Si total es = a 0, color negro
                    Si total es < a 0, color rojo  */}
            </div>
        </div>
    );
}