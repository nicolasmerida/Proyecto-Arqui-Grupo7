// app/ui/ticket/ticket-card.tsx
import { HiOutlineCash } from "react-icons/hi";

interface TicketCardProps {
    ticket: number
}

export default function TicketCard({ ticket }: TicketCardProps) {
    return (
        <div className="flex flex-col border p-4 rounded-md shadow-sm bg-white min-w-[200px]">
            <div className="flex font-semibold text-base text-gray-400 justify-between items-center mb-2">
                <span>Ticket promedio</span>
                <HiOutlineCash className="text-xl" />
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold font-serif text-black">
                    ${ticket.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-sm text-gray-400 font-medium">/ mesa</span>
            </div>
        </div>
    ); 
}