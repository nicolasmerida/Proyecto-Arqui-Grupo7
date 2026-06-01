// app/ui/ticket/ticket-card.tsx
import { HiOutlineCash } from "react-icons/hi";

export default function TicketCard() {

    return (
        <div className="flex flex-col border">
            <div className="flex font-semibold text-base text-gray-400 justify-between">
                Ticket promedio <HiOutlineCash />
            </div>
            <div className="flex text-xl text-black font-serif">
                {/* Costo de ticket promedio */}
            </div>
            <span className="text-sm text-gray-400">
                por mesa
            </span>
        </div>
    ); 
}