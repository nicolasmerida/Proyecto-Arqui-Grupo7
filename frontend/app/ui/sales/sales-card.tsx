// app/ui/sales/sales-card.tsx
import { HiOutlineTrendingUp } from "react-icons/hi";

export default function SalesCard() {

    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                Ventas <HiOutlineTrendingUp />
            </div>
        </div>
    );
}