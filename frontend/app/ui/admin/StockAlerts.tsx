// app/ui/admin/StockAlerts.tsx
'use client';
import { Ingrediente } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";

export default function StockAlerts() {
    const [alerts, setAlerts] = useState<Ingrediente[]>([]);
    
    //Consultar alertas de stock bajo al backend
    useEffect(() => {
        const fetchAlerts = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ingredientes/bajo-stock`)
            if (!response.ok) {
                let errorMessage = `Error ${response.status} inesperado al consultar ingredientes de bajo stock`;
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
            setAlerts(data);
        }
        catch (error) {
            console.error("Error al obtener los alertas de stock:", error);
        }
        };

        fetchAlerts();
    }, [])

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
                        <span className="text-gray-400">{alert.stock} {alert.unidad} • minimo {alert.stockMinimo}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}