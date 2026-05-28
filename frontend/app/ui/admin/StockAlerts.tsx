// app/ui/admin/StockAlerts.tsx
'use client';
import { Ingrediente } from "@/app/lib/definitions";
import { useState } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";

export default function StockAlerts() {
    const [alerts, setAlerts] = useState<Ingrediente[]>([]);
    //Obtener alertas de stock
    return (
        <div className="flex flex-col rounded-md mx-5 text-black bg-red-300 border-red-600">
            <div className="flex items-center gap-1 text-red-600">
                <HiOutlineInformationCircle className="text-lg" />Alertas de stock
            </div>
            <div className="grid grid-cols-3 gap-2">
                {/* Panel con alertas en grilla */}
                {alerts.map((alert) => (
                    <div className="flex flex-col border rounded-lg">
                        <span className="font-semibold text-black">{alert.nombre}</span>
                        <span className="text-gray-400">{alert.stock} {alert.unidad} • minimo {alert.stock_mininmo}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}