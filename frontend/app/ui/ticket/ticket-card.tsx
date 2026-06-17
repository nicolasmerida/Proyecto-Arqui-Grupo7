// app/ui/ticket/ticket-card.tsx
import { HiOutlineCash } from "react-icons/hi";

interface TicketCardProps {
    ticket: number
}

export default function TicketCard({ ticket }: TicketCardProps) {
// Pensar que recibe para saber como mostrarlo en la pantalla
    return (
        <div className="flex flex-col border">
            <div className="flex font-semibold text-base text-gray-400 justify-between">
                Ticket promedio <HiOutlineCash />
            </div>
            <div className="flex text-xl text-black font-serif">
                {ticket}
            </div>
            <span className="text-sm text-gray-400">
                por mesa
            </span>
        </div>
    ); 
}