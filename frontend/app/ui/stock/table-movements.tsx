// app/ui/stock/tabñe-movements.tsx
'use client';
import { Mov_Stock } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { HiOutlineArrowSmDown, HiOutlineArrowSmUp } from "react-icons/hi";

export default function TableMovements() {
    const [movements, setMovements] = useState<Mov_Stock[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/movimientos-stock`)
            .then(res => res.json())
            .then(data => setMovements(data))
            .catch(console.error);
    }, []);

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
                                        {new Date(mov.fecha).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <span className="font-semibold text-black">{mov.ingrediente.nombre}</span>
                                    </td>
                                    <td className={`font-medium rounded-xl border ${condEstilo}`}>
                                        {(mov.cantidad > 0) ? (
                                            <span><HiOutlineArrowSmUp /> Ingreso</span>
                                        ) : (
                                            <span><HiOutlineArrowSmDown /> Consumo</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className="font-medium">{mov.cantidad} {mov.ingrediente.unidad}</span>
                                    </td>
                                    <td>
                                        <span className="font-medium">{mov.usuario.rol}</span>
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