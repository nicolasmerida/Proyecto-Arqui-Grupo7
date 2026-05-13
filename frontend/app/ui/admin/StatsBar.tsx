// app/ui/admin/StatsBar.tsx
import SalesCard from "@/app/ui/sales/sales-card";
import CommandsCard from "@/app/ui/commands/commands-card";
import StaffCard from "@/app/ui/staff/staff-card";
import TicketCard from "@/app/ui/ticket/ticket-card";

export default function StatsBar() {

    return (
        <div className="flex flex-row justify-between">
            <SalesCard />
            <CommandsCard />
            <TicketCard />
            <StaffCard />
        </div>
    );
}