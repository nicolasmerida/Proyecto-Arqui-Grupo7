// app/ui/stock/AddIngredient.tsx
'use client';
import { Ingrediente } from "@/app/lib/definitions";
import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";

const UNIDADES_OPTIONS = ["u", "kg", "g", "l", "ml"];

interface AddIngredientProps {
    show: boolean;
    onClose: () => void;
    onIngredientCreate: (ing: Ingrediente) => void;
};

export default function AddIngredient({ show, onClose, onIngredientCreate } : AddIngredientProps) {
    const [nombre, setNombre] = useState('');
    const [stock, setStock] = useState<number>(0);
    const [stockMinimo, setStockMinimo] = useState<number>(0);
    const [unidad, setUnidad] = useState<string>(UNIDADES_OPTIONS[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!show) return null;

    const handleAdd = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ingredientes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: nombre,
                    stock: stock,
                    stockMinimo: stockMinimo,
                    unidad: unidad
                })
            });
            if (!response.ok) {
                let errorMessage = `Error ${response.status} inesperado al registrar un nuevo ingrediente`;
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
            onIngredientCreate(data);
            onClose();
        }
        catch (error) {
            console.error("Error al registrar nuevo ingrediente:", error);
            setError("Error al registrar el ingrediente");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-bold font-serif italic text-slate-800">
                            Nuevo Ingrediente
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Registra un nuevo elemento en el inventario</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <HiOutlineX size={20} />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700">
                            Nombre del ingrediente
                        </label>
                        <input
                            value={nombre}
                            onChange={(event) => setNombre(event.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            placeholder="Ej: Harina"
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">
                                Stock inicial
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={stock === 0 ? '' : stock}
                                onChange={(event) => setStock(Number(event.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400"
                                placeholder="0"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">
                                Stock mínimo
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={stockMinimo === 0 ? '' : stockMinimo}
                                onChange={(event) => setStockMinimo(Number(event.target.value))}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400"
                                placeholder="0"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700">
                            Unidad de medida
                        </label>
                        <select
                            value={unidad}
                            onChange={(event) => setUnidad(event.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer"
                            required
                        >
                            {UNIDADES_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                            ))}
                        </select>
                    </div>

                    {error && (
                        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button className="px-5 py-2.5 text-sm font-bold rounded-xl text-slate-600 hover:bg-slate-200 transition-colors" onClick={onClose} disabled={loading}>
                        Cancelar
                    </button>
                    <button className={`px-6 py-2.5 text-sm font-bold rounded-xl text-white shadow-md transition-all ${loading || !nombre ? 'bg-blue-400 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5'}`} onClick={handleAdd} disabled={loading || !nombre}>
                        {loading ? "Creando..." : "Crear Ingrediente"}
                    </button>
                </div>
            </div>
        </div>
    );
}