// app/ui/stock/table-stock
'use client';
import { Ingrediente } from "@/app/lib/definitions";
import { useEffect, useState, useMemo } from "react";
import { HiOutlinePlusSm, HiOutlineCube, HiOutlineSelector, HiOutlineChevronUp, HiOutlineChevronDown } from "react-icons/hi";
import AddStock from "@/app/ui/stock/AddStock";
import AddIngredient from "@/app/ui/stock/AddIngredient";

type Condition = "todos" | "regla" | "advertencia" | "bajo";

export default function TableStock() {
    const [ingredients, setIngredients] = useState<Ingrediente[]>([]);
    const [condicion, setCondicion] = useState<Condition>("todos");
    const [showDetail, setShowDetail] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [selectedIng, setSelected] = useState<Ingrediente>();
    const [sortConfig, setSortConfig] = useState<{ key: keyof Ingrediente | 'condicion', direction: 'asc' | 'desc' } | null>({ key: 'nombre', direction: 'asc' });

    const fetchIngredients = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ingredientes`)
            if (!response.ok) {
                let errorMessage = `Error ${response.status} inesperado al consultar ingredientes`;
                let errorCode = `ERROR_DESCONOCIDO`;
                try {
                    const errorData = await response.json();
                    if (errorData?.error?.message) {
                        errorMessage = errorData.error.message;
                        errorCode = errorData.error.code || errorCode;
                    }
                }
                catch (e) {}
                throw new Error(errorMessage, { cause: errorCode });
            }

            const data = await response.json();
            setIngredients(data);
        }
        catch (error) {
            console.error("Error al obtener los ingredientes:", error);
        }
    };
    
    useEffect(() => {
        fetchIngredients();
    }, [])

    var ingFiltrados = ingredients.filter((ingredient) =>
        (condicion === "regla") ? (ingredient.stock > ingredient.stockMinimo) :
        (condicion === "bajo") ? (ingredient.stock < ingredient.stockMinimo) :
        (condicion === "advertencia") ? (ingredient.stock === ingredient.stockMinimo) :
        true 
    );

    const getCondicion = (ingrediente: Ingrediente): Condition => {
        if (ingrediente.stock > ingrediente.stockMinimo) return "regla";
        if (ingrediente.stock < ingrediente.stockMinimo) return "bajo";
        return "advertencia";
    };

    const getCondicionValue = (cond: Condition): number => {
        if (cond === 'bajo') return 1;
        if (cond === 'advertencia') return 2;
        return 3; // regla
    };

    const sortedIngredients = useMemo(() => {
        let sortableItems = [...ingFiltrados];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue: any = a[sortConfig.key as keyof Ingrediente];
                let bValue: any = b[sortConfig.key as keyof Ingrediente];

                if (sortConfig.key === 'condicion') {
                    aValue = getCondicionValue(getCondicion(a));
                    bValue = getCondicionValue(getCondicion(b));
                } else if (typeof aValue === 'string') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [ingFiltrados, sortConfig]);

    const requestSort = (key: keyof Ingrediente | 'condicion') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof Ingrediente | 'condicion') => {
        if (!sortConfig || sortConfig.key !== key) return <HiOutlineSelector className="inline ml-1 opacity-40" size={16} />;
        return sortConfig.direction === 'asc' ? <HiOutlineChevronUp className="inline ml-1 text-slate-800" size={16} /> : <HiOutlineChevronDown className="inline ml-1 text-slate-800" size={16} />;
    };

    const handleAddStock = (ingrediente: Ingrediente) => {
        setSelected(ingrediente);
        setShowDetail(true);
    };

    const handleStockUpdate = (updatedIng: Ingrediente) => {
        setIngredients((prev) =>
            prev.map((ing) => (ing.idIngrediente === updatedIng.idIngrediente ? updatedIng : ing))
        );
    };

    const handleCreateIngredient = (nuevo: Ingrediente) => {
        setIngredients((prev) => [...prev, nuevo]);
        fetchIngredients();
    }

    return (
        <>
        <div className="flex items-center justify-between mb-2">
            <div className="grid grid-cols-4 rounded-md p-2 space-x-3 bg-slate-300">
                <button className={`${(condicion === "todos") ? 'text-white border border-orange-400 bg-amber-400 rounded-md' : 'text-amber-200'}`} onClick={() => setCondicion("todos")}>Todos</button>
                <button className={`${(condicion === "regla") ? 'text-white border border-orange-400 bg-amber-400 rounded-md' : 'text-amber-200'}`} onClick={() => setCondicion("regla")}>En regla</button>
                <button className={`${(condicion === "advertencia") ? 'text-white border border-orange-400 bg-amber-400 rounded-md' : 'text-amber-200'}`} onClick={() => setCondicion("advertencia")}>Advertencia</button>
                <button className={`${(condicion === "bajo") ? 'text-white border border-orange-400 bg-amber-400 rounded-md' : 'text-amber-200'}`} onClick={() => setCondicion("bajo")}>Bajo</button>
            </div>
            <button onClick={() => setShowCreate(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white transition-all hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                    <HiOutlinePlusSm size={20} /> Nuevo ingrediente
            </button>
        </div>
        <div className="overflow-x-auto bg-white rounded-2xl border">
            <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('nombre')}>
                                Ingrediente {getSortIcon('nombre')}
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('stock')}>
                                Stock Actual {getSortIcon('stock')}
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('condicion')}>
                                Condición {getSortIcon('condicion')}
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => requestSort('stockMinimo')}>
                                Mínimo {getSortIcon('stockMinimo')}
                            </th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {(sortedIngredients.length > 0) ? (
                        sortedIngredients.map((ingrediente) => {
                            const condIngrediente = getCondicion(ingrediente);
                            const condTexto = (condIngrediente === "regla") ? "En Regla" :
                                                (condIngrediente === "bajo") ? "Bajo" :
                                                "Advertencia";
                            const condEstilo = (condIngrediente === "regla") ? "text-emerald-700 bg-emerald-100 border-emerald-200" :
                                                (condIngrediente === "bajo") ? "text-rose-700 bg-rose-100 border-rose-200" :
                                                "text-amber-700 bg-amber-100 border-amber-200";

                            return (
                            <tr key={ingrediente.idIngrediente} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 text-slate-400 rounded-lg">
                                            <HiOutlineCube size={18} />
                                        </div>
                                        <span className="font-semibold text-slate-800">{ingrediente.nombre}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <span className={`font-bold text-lg ${condIngrediente === 'bajo' ? 'text-rose-600' : 'text-slate-800'}`}>{ingrediente.stock}</span>
                                    <span className="text-sm text-slate-500 ml-1">{ingrediente.unidad}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider inline-block ${condEstilo}`}>
                                        {condTexto}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <span className="font-medium text-slate-600">{ingrediente.stockMinimo}</span>
                                    <span className="text-xs text-slate-400 ml-1">{ingrediente.unidad}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <button onClick={() => handleAddStock(ingrediente)}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                    >
                                        <HiOutlinePlusSm size={18} /> Ingreso
                                    </button>
                                </td>
                            </tr>
                            );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-500">
                                        <HiOutlineCube size={48} className="mb-3 opacity-20" />
                                        <span className="text-slate-500 font-medium">No hay ingredientes para mostrar</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
        </div>
        <AddStock show={showDetail} onClose={() => setShowDetail(false)} onStockUpdate={handleStockUpdate} ingredient={selectedIng} />
        <AddIngredient show={showCreate} onClose={() => setShowCreate(false)} onIngredientCreate={handleCreateIngredient} />
        </>
    );
}