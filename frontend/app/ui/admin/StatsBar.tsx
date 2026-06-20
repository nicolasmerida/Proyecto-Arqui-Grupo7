// app/ui/admin/StatsBar.tsx
'use client';
import SalesCard from "@/app/ui/sales/sales-card";
import CommandsCard from "@/app/ui/commands/command-card";
import StaffCard from "@/app/ui/staff/staff-card";
import TicketCard from "@/app/ui/ticket/ticket-card";
import { useEffect, useState } from "react";
import { ComandaResumen, Usuario } from "@/app/lib/definitions";

type Stats = {
    sales: number;
    commands: ComandaResumen[];
    ticket: number;
    staff: Usuario[];
}

export default function StatsBar() {
    const [stats, setStats] = useState<Stats | null>(null);
    
    //Consultar comandas, ventas, personal y ticket promedio
    const fetchStats = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/stats`);
            if (!response.ok) {
                // Como el endpoint de estadísticas (MétricaController) no está implementado
                // en el backend todavía, devolvemos datos vacíos o mockeados para que
                // no crashee la vista del administrador.
                setStats({
                    sales: 0,
                    commands: [],
                    ticket: 0,
                    staff: []
                });
                return;
            }

            const data = await response.json();
            setStats(data);
        }
        catch (error) {
            console.log("No se pudo obtener las estadísticas. Usando datos por defecto.");
            setStats({
                sales: 0,
                commands: [],
                ticket: 0,
                staff: []
            });
        }
    };

    useEffect(() => {
        fetchStats();
    }, [])

    if (!stats)
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col bg-white/50 border border-slate-200/60 rounded-2xl p-5 shadow-sm h-32 justify-center gap-4 animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-200/80"></div>
                            <div className="h-4 bg-slate-200/80 rounded-full w-24"></div>
                        </div>
                        <div className="h-8 bg-slate-200/80 rounded-xl w-2/3 ml-1"></div>
                    </div>
                ))}
            </div>
        );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SalesCard sales={stats.sales}/>
            <CommandsCard commands={stats.commands}/>
            <TicketCard ticket={stats.ticket}/>
            <StaffCard staff={stats.staff}/>
        </div>
    );
}