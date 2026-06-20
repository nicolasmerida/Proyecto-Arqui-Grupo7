// app/ui/sales/table-sales
import { useEffect, useState } from "react";

export default function TableSales() {
    //Ajustar tipo de ventas segun backend
    const [sales, setSales] = useState<Venta[]>([]);

    //Consultar movimientos de stock al backend
    useEffect(() => {
        const fetchSales = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
                const response = await fetch(`${baseUrl}/api/ventas`)
                //Ajustar endpoint de ventas
                if (!response.ok) {
                    let errorMessage = `Error ${response.status} inesperado al consultar ventas`;
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
                console.error("Error al obtener las ventas:", error);
            }
        };

        fetchSales();
    }, [])

    return (
        <div className="overflow-hidden rounded-xl border">
            <table className="w-full p-2">
                <thead>
                    <tr className="text-left text-sm uppercase">
                        <th>Fecha</th>
                        <th>Comanda</th>
                        <th>Platos</th>
                        <th>Precio</th>
                    </tr>
                </thead>
                <tbody>
                    {(sales.length > 0) ? (
                        sales.map((s) => {

                            return (
                                <tr key={s.idVenta} className="m-2">
                                    <td className="font-medium">
                                        {s.comanda.fecha}
                                    </td>
                                    <td>
                                        <span className="font-semibold text-black">{s.comanda.numeroComanda}</span>
                                    </td>
                                    <td className="font-medium rounded-xl border text-black">
                                        <div className="flex flex-col gap-1">
                                            {s.comanda.map((plato) => {
                                                <span className="text-base font-medium">{plato.nombrePlato}</span>
                                            }
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="font-medium">${/* Precio total de la comanda */}</span>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td className="text-black italic">
                                No hay ventas para mostrar
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}