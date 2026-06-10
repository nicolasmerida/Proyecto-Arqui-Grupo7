// app/ui/stock/AddIngredient.tsx
'use client';
import { Ingrediente } from "@/app/lib/definitions";
import { useState } from "react";
import { HiOutlineXCircle } from "react-icons/hi";

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
        //Invocar la funcion para ingresar la cantidad en newStock del ingrediente ingredient
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
            onIngredientCreate(data);//El parametro es el ingrediente con stock actualizado
            onClose();
        }
        catch (error) {
            console.error("Error al registrar nuevo ingrediente:", error);
            setError("Error al registrar el ingrediente");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 items-start justify-center transition-opacity duration-300 ease-in-out">
            <div className="w-full max-w-full mx-auto bg-opacity-95 text-black transition-all duration-300 ease-in-out transform absolute shadow-md">
                <div className="flex flex-col justify-between border rounded-xl m-2">
                    <span className="text-xl font-serif font-semibold text-black">
                        Registrar nuevo ingrediente
                    </span>
                    <button onClick={onClose}>
                        <HiOutlineXCircle className="text-xl" />
                    </button>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-col m-1">
                        <label className="space-y-2 text-sm font-medium text-slate-700">
                            Nombre del ingrediente
                            <input
                                value={nombre}
                                onChange={(event) => setNombre(event.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                                placeholder="Ej: Harina"
                                required
                            />
                        </label>
                    </div>
                    <div className="flex flex-col m-1">
                        <label className="space-y-2 text-sm font-medium text-slate-700">
                            Stock inicial
                            <input
                                type="number"
                                min={0}
                                value={stock}
                                onChange={(event) => setStock(Number(event.target.value))}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                                placeholder="0"
                                required
                            />
                        </label>
                    </div>
                    <div className="flex flex-col m-1">
                        <label className="space-y-2 text-sm font-medium text-slate-700">
                            Stock mínimo
                            <input
                                type="number"
                                min={0}
                                value={stockMinimo}
                                onChange={(event) => setStockMinimo(Number(event.target.value))}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                                placeholder="0"
                                required
                            />
                        </label>
                    </div>
                    <div className="flex flex-col m-1">
                        <label className="space-y-2 text-sm font-medium text-slate-700">
                            Unidad de medida
                            <select
                                value={unidad}
                                onChange={(event) => setUnidad(event.target.value)}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                                required
                            >
                                {UNIDADES_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end gap-2 mt-2">
                        <button className="px-4 py-2 text-center rounded-lg text-white bg-green-500 hover:bg-green-600" onClick={handleAdd} disabled={loading}>
                            {loading ? "Guardando..." : "Crear"}
                        </button>
                        <button className="px-4 py-2 text-center rounded-lg text-white bg-gray-500 hover:bg-gray-600" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}