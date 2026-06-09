// app/ui/admin/StockAlerts.tsx
'use client';
import { Ingrediente } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";

export default function StockAlerts() {
    const [alerts, setAlerts] = useState<Ingrediente[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ingredientes/bajo-stock`)
            .then(res => res.json())
            .then(data => setAlerts(data))
            .catch(console.error);
    }, []);
    return (
        <div className="flex flex-col rounded-md mx-5 text-black bg-red-300 border-red-600">
            <div className="flex items-center gap-1 text-red-600">
                <HiOutlineInformationCircle className="text-lg" />Alertas de stock
            </div>
            <div className="grid grid-cols-3 gap-2">
                {/* Panel con alertas en grilla */}
                {alerts.map((alert) => (
                    <div key={alert.idIngrediente} className="flex flex-col border rounded-lg">
                        <span className="font-semibold text-black">{alert.nombre}</span>
                        <span className="text-gray-400">{alert.stock} {alert.unidad} • minimo {alert.stockMinimo}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}