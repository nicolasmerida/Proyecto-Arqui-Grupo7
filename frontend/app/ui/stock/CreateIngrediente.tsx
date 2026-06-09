'use client';
import { Ingrediente } from "@/app/lib/definitions";
import { useState } from "react";
import { HiOutlineXCircle } from "react-icons/hi";

const UNIDADES = ["kg", "g", "l", "ml", "u"];

interface CreateIngredienteProps {
    show: boolean;
    onClose: () => void;
    onCreated: (ing: Ingrediente) => void;
}

export default function CreateIngrediente({ show, onClose, onCreated }: CreateIngredienteProps) {
    const [nombre, setNombre] = useState("");
    const [stock, setStock] = useState<number>(0);
    const [stockMinimo, setStockMinimo] = useState<number>(0);
    const [unidad, setUnidad] = useState("u");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!show) return null;

    const handleClose = () => {
        setNombre(""); setStock(0); setStockMinimo(0); setUnidad("u"); setError(null);
        onClose();
    };

    const handleSubmit = async () => {
        if (!nombre.trim()) { setError("El nombre es obligatorio."); return; }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ingredientes`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre: nombre.trim(), stock, stockMinimo, unidad }),
                }
            );
            if (!response.ok) { setError("Error al crear el ingrediente."); return; }
            const nuevo: Ingrediente = await response.json();
            onCreated(nuevo);
            handleClose();
        } catch {
            setError("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm mx-4 p-5">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-serif font-semibold text-black">Nuevo ingrediente</span>
                    <button onClick={handleClose} className="text-gray-500 hover:text-black">
                        <HiOutlineXCircle className="text-2xl" />
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Nombre</label>
                        <input
                            type="text"
                            placeholder="Ej: Harina"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-black text-sm"
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-sm text-gray-600">Stock inicial</label>
                            <input
                                type="number"
                                min={0}
                                value={stock}
                                onChange={e => setStock(Number(e.target.value))}
                                className="border rounded-lg px-3 py-2 text-black text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-sm text-gray-600">Stock mínimo</label>
                            <input
                                type="number"
                                min={0}
                                value={stockMinimo}
                                onChange={e => setStockMinimo(Number(e.target.value))}
                                className="border rounded-lg px-3 py-2 text-black text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-600">Unidad de medida</label>
                        <select
                            value={unidad}
                            onChange={e => setUnidad(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-black text-sm"
                        >
                            {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 rounded-lg border text-sm text-gray-600 hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-black text-white text-sm disabled:opacity-50"
                        >
                            {loading ? "Guardando..." : "Crear"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
