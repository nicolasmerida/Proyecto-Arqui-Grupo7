// app/ui/ticket/ticket-card.tsx
import { HiOutlineCash } from "react-icons/hi";

export default function TicketCard() {

    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                Ticket promedio <HiOutlineCash />
            </div>
        </div>
    ); 
}