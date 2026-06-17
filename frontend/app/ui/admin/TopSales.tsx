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
        <div className="flex flex-col border m-2">
            <div className="flex flex-col m-2">
                <span className="text-black text-lg font-serif">Más vendidos</span>
                <span className="text-gray-400 text-base">Top 5</span>
            </div>
            <div className="space-y-2">
                {sales.map((item, index) => {
                    const porcentaje = (item.cantidad / max) * 100;

                    return (
                        <div className="flex flex-col gap-1" key={index}>
                            <div className="flex justify-between">
                                <div className="gap-1">
                                    <span className="italic text-gray-400">{index + 1}.</span>
                                    <span className="text-black">{item.plato.nombre}</span>
                                </div>
                                <span>{item.cantidad}</span>
                            </div>
                            {/* Barra */}
                            <div className="h-3 w-full rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${porcentaje}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}