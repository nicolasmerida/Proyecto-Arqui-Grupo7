// app/ui/stock/AddStock.tsx
'use client';
import { Ingrediente } from "@/app/lib/definitions";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { HiOutlineArrowRight, HiOutlineX } from "react-icons/hi";

interface AddStockProps {
    show: boolean;
    onClose: () => void;
    onStockUpdate: (ing: Ingrediente) => void;
    ingredient: Ingrediente | undefined;
};

export default function AddStock({ show, onClose, onStockUpdate, ingredient} : AddStockProps) {
    const [newStock, setNewStock] = useState<number>(0);
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    
    if (!show || !ingredient) return null;

    const handleAdd = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ingredientes/${ingredient?.idIngrediente}/stock?cantidad=${newStock}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": session?.user?.id || "1",
                }
            });
            if (!response.ok) {
                let errorMessage = `Error ${response.status} inesperado al actualizar el stock de un ingrediente`;
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
            onStockUpdate(data);
            setNewStock(0);
            onClose();
        }
        catch (error) {
            console.error("Error al actualizar el stock de un ingrediente:", error);
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
                            Ingreso de Stock
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Registrar nueva entrada de inventario</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <HiOutlineX size={20} />
                    </button>
                </div>
                
                <div className="p-6 space-y-5">
                    <div className="flex flex-col p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ingrediente Seleccionado</span>
                        <span className="font-semibold text-lg text-slate-900">{ingredient?.nombre}</span>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">
                            Cantidad a Ingresar
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min={0}
                                value={newStock === 0 ? '' : newStock}
                                onChange={(e) => setNewStock(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400 text-lg font-medium"
                                placeholder="0"
                                required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <span className="text-slate-400 font-bold">{ingredient.unidad}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col pt-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Proyección de Stock</span>
                        <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-slate-500 font-medium">Actual</span>
                                <span className="text-xl font-bold text-slate-700">{ingredient.stock}</span>
                            </div>
                            <HiOutlineArrowRight className="text-blue-400 mx-2" size={24} />
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-blue-600 font-bold">Resultante</span>
                                <span className="text-2xl font-bold text-blue-700">{ingredient.stock + (newStock || 0)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button className="px-5 py-2.5 text-sm font-bold rounded-xl text-slate-600 hover:bg-slate-200 transition-colors" onClick={onClose} disabled={loading}>
                        Cancelar
                    </button>
                    <button className={`px-6 py-2.5 text-sm font-bold rounded-xl text-white shadow-md transition-all ${loading || !newStock || newStock <= 0 ? 'bg-blue-400 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5'}`} onClick={handleAdd} disabled={loading || !newStock || newStock <= 0}>
                        {loading ? "Confirmando..." : "Confirmar Ingreso"}
                    </button>
                </div>
            </div>
        </div>
    );
}