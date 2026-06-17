// app/ui/admin/StatsBar.tsx
'use client';
import SalesCard from "@/app/ui/sales/sales-card";
import CommandsCard from "@/app/ui/commands/command-card";
import StaffCard from "@/app/ui/staff/staff-card";
import TicketCard from "@/app/ui/ticket/ticket-card";
import { useState } from "react";

export default function StatsBar() {
    const [stats, setStats] = useState();
    
    //Consultar comandas, ventas, personal y ticket promedio
    const fetchStats = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/stats`)
            if (!response.ok) {
                let errorMessage = `Error ${response.status} inesperado al consultar estadisticas del administrador`;
                let errorCode = `ERROR_DESCONOCIDO`;
                try {
                //Intento obtener el mensaje de error desde la API
                const errorData = await response.json();
                if (errorData?.error?.message) {
                    errorMessage = errorData.error.message;
                    errorCode = errorData.error.code || errorCode;
                }
                }
                catch (e) {
                //Se mantiene el mensaje de error por defecto
                }
                //Lanzo el error
                throw new Error(errorMessage, { cause: errorCode });
            }

            const data = await response.json();
            setStats(data);
        }
        catch (error) {
            console.error("Error al obtener las estadisticas:", error);
        }
    };

    return (
        <div className="flex flex-row justify-between">
            <SalesCard sales={stats.sales}/>
            <CommandsCard commands={stats.commands}/>
            <TicketCard ticket={stats.ticket}/>
            <StaffCard staff={stats.staff}/>
        </div>
    );
}