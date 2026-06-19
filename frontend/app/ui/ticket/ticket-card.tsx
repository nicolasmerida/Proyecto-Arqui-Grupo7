// app/ui/ticket/ticket-card.tsx
import { HiOutlineCash } from "react-icons/hi";

interface TicketCardProps {
    ticket: number
}

export default function TicketCard({ ticket }: TicketCardProps) {
    return (
        <div className="flex flex-col bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex font-semibold text-sm text-slate-500 justify-between items-center mb-4">
                <span className="uppercase tracking-wider">Ticket Promedio</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <HiOutlineCash size={20} />
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800 tracking-tight">
                    ${ticket.toFixed(2)}
                </span>
            </div>
            <div className="mt-2">
                <span className="text-xs text-slate-400 font-medium">por mesa atendida</span>
            </div>
        </div>
    ); 
}