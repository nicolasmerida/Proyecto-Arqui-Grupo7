// app/ui/admin/StockAlerts.tsx
'use client';
import { Ingrediente } from "@/app/lib/definitions";
import { useState, useCallback } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { useStompClient } from "@/app/lib/hooks/useStompClient";

interface StockAlertsProps {
    initialAlerts: Ingrediente[];
}

export default function StockAlerts({ initialAlerts }: StockAlertsProps) {
    const [alerts, setAlerts] = useState<Ingrediente[]>(initialAlerts);
    
    // Escuchar actualizaciones en tiempo real de ingredientes bajo stock
    const onMessageReceived = useCallback((nuevoIngrediente: Ingrediente) => {
        setAlerts((prevAlerts) => {
            const exists = prevAlerts.find((ing) => ing.idIngrediente === nuevoIngrediente.idIngrediente);
            if (exists) {
                // Actualizar valores del ingrediente si ya estaba en la lista de alertas
                return prevAlerts.map((ing) => 
                    ing.idIngrediente === nuevoIngrediente.idIngrediente ? nuevoIngrediente : ing
                );
            } else {
                // Agregar a la lista de alertas
                return [...prevAlerts, nuevoIngrediente];
            }
        });
    }, []);

    const { connected } = useStompClient<Ingrediente>('/topic/admin/stock', onMessageReceived);

    return (
        <div className="flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full relative overflow-hidden">
            {/* Indicador de conexión sutil */}
            {!connected && (
                <div className="absolute top-4 right-4 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" title="Desconectado del servidor de alertas"></span>
                </div>
            )}
            
            <div className="flex flex-col mb-6">
                <div className="flex items-center gap-2 text-rose-600 mb-1">
                    <HiOutlineInformationCircle className="text-2xl" />
                    <span className="text-slate-900 text-xl font-bold font-serif italic">Alertas de Stock</span>
                </div>
                <span className="text-slate-500 text-sm font-medium">Ingredientes por debajo del mínimo</span>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 space-y-3">
                {alerts.length > 0 ? (
                    alerts.map((alert) => (
                        <div key={alert.idIngrediente} className="flex flex-col border border-rose-100 bg-rose-50/50 rounded-xl p-3 hover:bg-rose-50 transition-colors">
                            <div className="flex justify-between items-start">
                                <span className="font-semibold text-slate-800">{alert.nombre}</span>
                                <span className="text-xs font-bold bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full animate-pulse">BAJO</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-slate-600 text-sm font-medium">Actual: <span className="text-rose-600 font-bold">{alert.stock}</span> {alert.unidad}</span>
                                <span className="text-slate-400 text-xs">Mínimo: {alert.stockMinimo}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3">
                            <HiOutlineInformationCircle className="text-2xl" />
                        </div>
                        <span className="text-slate-500 font-medium text-sm">Stock óptimo</span>
                        <span className="text-slate-400 text-xs mt-1">No hay alertas activas</span>
                    </div>
                )}
            </div>
        </div>
    );
}