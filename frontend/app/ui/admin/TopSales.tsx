// app/ui/admin/TopSales.tsx
'use client';
import { useEffect, useState } from "react";

type TopSaleItem = {
    cantidad: number;
    plato: {
        idPlato: number;
        nombre: string;
    }
}

export default function TopSales() {
    const [sales, setSales] = useState<TopSaleItem[]>([]);
    const max = Math.max(...sales.map(p => p.cantidad), 1);

    //Consultar top de ventas al backend
    useEffect(() => {
        const fetchSales = async () => {
            try {
                //Ajustar URL de la API
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items-pedido/ventas`)
                if (!response.ok) {
                    let errorMessage = `Error ${response.status} inesperado al consultar top de ventas`;
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
                setSales(data);
            }
            catch (error) {
                console.error("Error al obtener el top de ventas:", error);
            }
        };

        fetchSales();
    }, [])

    return (
        <div className="flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full">
            <div className="flex flex-col mb-6">
                <span className="text-slate-900 text-xl font-bold font-serif italic">Platos Más Vendidos</span>
                <span className="text-slate-500 text-sm font-medium">Top 5 preferidos por los clientes</span>
            </div>
            <div className="space-y-5 flex-grow">
                {sales.length > 0 ? sales.map((item, index) => {
                    const porcentaje = (item.cantidad / max) * 100;
                    const isTop = index === 0;

                    return (
                        <div className="flex flex-col gap-2 group" key={index}>
                            <div className="flex justify-between items-end">
                                <div className="flex items-center gap-3">
                                    <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${isTop ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {index + 1}
                                    </span>
                                    <span className={`font-semibold ${isTop ? 'text-slate-900' : 'text-slate-700'} group-hover:text-blue-600 transition-colors`}>
                                        {item.plato.nombre}
                                    </span>
                                </div>
                                <span className="font-bold text-slate-900">{item.cantidad} <span className="text-xs text-slate-400 font-normal">uds</span></span>
                            </div>
                            {/* Barra */}
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-1000 ease-out ${isTop ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500'}`}
                                    style={{ width: `${porcentaje}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="flex items-center justify-center h-full text-slate-400 italic text-sm">
                        No hay ventas registradas aún.
                    </div>
                )}
            </div>
        </div>
    );
}