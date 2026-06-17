// app/ui/stock/table-movements.tsx
'use client';
import { Mov_Stock } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { HiOutlineArrowSmDown, HiOutlineArrowSmUp } from "react-icons/hi";

export default function TableMovements() {
    const [movements, setMovements] = useState<Mov_Stock[]>([]);

    //Consultar movimientos de stock al backend
    useEffect(() => {
        const fetchMovements = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
                const response = await fetch(`${baseUrl}/api/movimientos-stock`)
                if (!response.ok) {
                    let errorMessage = `Error ${response.status} inesperado al consultar movimientos de stock`;
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
                setMovements(data);
            }
            catch (error) {
                console.error("Error al obtener los movimientos de stock:", error);
            }
        };

        fetchMovements();
    }, [])

    return (
        <div className="overflow-hidden rounded-xl border">
            <table className="w-full p-2">
                <thead>
                    <tr className="text-left text-sm uppercase">
                        <th>Fecha</th>
                        <th>Ingrediente</th>
                        <th>Tipo</th>
                        <th>Cantidad</th>
                        <th>Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    {(movements.length > 0) ? (
                        movements.map((mov) => {
                            const condEstilo = (mov.cantidad > 0) ?
                                "text-green-600 bg-green-300" :
                                "text-red-600 bg-red-300";

                            return (
                                <tr key={mov.idMov} className="m-2">
                                    <td className="font-medium">
                                        {mov.fecha}
                                    </td>
                                    <td>
                                        <span className="font-semibold text-black">{mov.nombreIngrediente}</span>
                                    </td>
                                    <td className={`font-medium rounded-xl border ${condEstilo}`}>
                                        {(mov.cantidad > 0) ? (
                                            <span><HiOutlineArrowSmUp /> Ingreso</span>
                                        ) : (
                                            <span><HiOutlineArrowSmDown /> Consumo</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className="font-medium">{mov.cantidad} {mov.unidadIngrediente}</span>
                                    </td>
                                    <td>
                                        <span className="font-medium">{mov.nombreUsuario}</span>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td className="text-black italic">
                                No hay movimientos para mostrar
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}