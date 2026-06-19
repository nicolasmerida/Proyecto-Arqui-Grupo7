// app/ui/stock/table-movements
'use client';
import { Mov_Stock } from "@/app/lib/definitions";
import { useEffect, useState, useMemo } from "react";
import { HiOutlineArrowSmDown, HiOutlineArrowSmUp, HiOutlineSwitchHorizontal, HiOutlineSelector, HiOutlineChevronUp, HiOutlineChevronDown } from "react-icons/hi";

export default function TableMovements() {
    const [movements, setMovements] = useState<Mov_Stock[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Mov_Stock, direction: 'asc' | 'desc' } | null>({ key: 'fecha', direction: 'desc' });

    useEffect(() => {
        const fetchMovements = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
                const response = await fetch(`${baseUrl}/api/movimientos-stock`)
                if (!response.ok) {
                    let errorMessage = `Error ${response.status} inesperado al consultar movimientos de stock`;
                    let errorCode = `ERROR_DESCONOCIDO`;
                    try {
                        const errorData = await response.json();
                        if (errorData?.error?.message) {
                            errorMessage = errorData.error.message;
                            errorCode = errorData.error.code || errorCode;
                        }
                    } catch (e) {}
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

    const sortedMovements = useMemo(() => {
        let sortableItems = [...movements];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [movements, sortConfig]);

    const requestSort = (key: keyof Mov_Stock) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof Mov_Stock) => {
        if (!sortConfig || sortConfig.key !== key) return <HiOutlineSelector className="inline ml-1 opacity-40" size={16} />;
        return sortConfig.direction === 'asc' ? <HiOutlineChevronUp className="inline ml-1 text-slate-800" size={16} /> : <HiOutlineChevronDown className="inline ml-1 text-slate-800" size={16} />;
    };

    return (
        <div className="overflow-x-auto bg-white rounded-2xl">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('fecha')}>
                            Fecha {getSortIcon('fecha')}
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('nombreIngrediente')}>
                            Ingrediente {getSortIcon('nombreIngrediente')}
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('cantidad')}>
                            Tipo {getSortIcon('cantidad')}
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('cantidad')}>
                            Cantidad {getSortIcon('cantidad')}
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('nombreUsuario')}>
                            Usuario {getSortIcon('nombreUsuario')}
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {(sortedMovements.length > 0) ? (
                        sortedMovements.map((mov) => {
                            const isIngreso = mov.cantidad > 0;
                            const condEstilo = isIngreso ?
                                "text-emerald-700 bg-emerald-50 border-emerald-200" :
                                "text-rose-700 bg-rose-50 border-rose-200";

                            return (
                                <tr key={mov.idMov} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-slate-600">{new Date(mov.fecha).toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-semibold text-slate-800">{mov.nombreIngrediente}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${condEstilo}`}>
                                            {isIngreso ? <HiOutlineArrowSmUp size={16}/> : <HiOutlineArrowSmDown size={16}/>}
                                            {isIngreso ? "Ingreso" : "Consumo"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <span className={`font-bold text-base ${isIngreso ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {isIngreso ? '+' : ''}{mov.cantidad}
                                        </span>
                                        <span className="text-sm text-slate-500 ml-1">{mov.unidadIngrediente}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                                                {mov.nombreUsuario.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-slate-700">{mov.nombreUsuario}</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center">
                                <div className="flex flex-col items-center justify-center text-slate-400">
                                    <HiOutlineSwitchHorizontal size={48} className="mb-3 opacity-20" />
                                    <span className="text-slate-500 font-medium">No hay movimientos registrados</span>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}