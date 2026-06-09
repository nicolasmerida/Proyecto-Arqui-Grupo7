// app/ui/stock/StockDetail.tsx
'use client';
import { Ingrediente } from "@/app/lib/definitions";
import { useState } from "react";
import { HiOutlineArrowSmRight, HiOutlineXCircle } from "react-icons/hi";

interface AddStockProps {
    show: Boolean;
    onClose: () => void;
    onStockUpdate: (ing: Ingrediente) => void;
    ingredient: Ingrediente | undefined;
};

export default function AddStock({ show, onClose, onStockUpdate, ingredient} : AddStockProps) {
    const [newStock, setNewStock] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    if (!show) return null;

    const handleAdd = async () => {
        if (!ingredient || newStock <= 0) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ingredientes/${ingredient.idIngrediente}/stock?cantidad=${newStock}`,
                { method: 'PUT' }
            );
            if (!response.ok) {
                setError('Error al registrar el ingreso. Intentá de nuevo.');
                return;
            }
            const updatedIng = await response.json();
            onStockUpdate(updatedIng);
            setNewStock(0);
            onClose();
        } catch {
            setError('No se pudo conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 items-start justify-center transition-opacity duration-300 ease-in-out">
            <div className="w-full max-w-full mx-auto bg-opacity-95 text-black transition-all duration-300 ease-in-out transform absolute shadow-md">
                <div className="flex flex-col justify-between border rounded-xl m-2">
                    <span className="text-xl font-serif font-semibold text-black">
                        Registrar ingreso de stock
                    </span>
                    <button onClick={onClose}>
                        <HiOutlineXCircle className="text-xl" />
                    </button>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-col m-1">
                        <span className="text-gray-800 text-lg">Ingrediente:</span>
                        <span className="font-serif ml-2">{ingredient?.nombre}</span>
                    </div>
                    <div className="flex flex-col m-1">
                        <span className="text-gray-800 text-lg">Cantidad ({ingredient?.unidad})</span>
                        <input type="text" placeholder={`0 ${ingredient?.unidad}`} value={newStock} onChange={(e) => setNewStock(Number(e.target.value))} required />
                    </div>
                    <div className="flex flex-col m-1">
                        <span className="text-base text-gray-500">Stock resultante</span>
                        <span className="font-serif text-xl text-black">
                            {(ingredient?.stock ?? 0)} <HiOutlineArrowSmRight /> {(ingredient?.stock ?? 0) + newStock}
                        </span>
                    </div>
                    {error && (
                        <div className="text-red-500 text-sm m-1">{error}</div>
                    )}
                    <div className="flex justify-end m-1">
                        <button className="text-center rounded-lg disabled:opacity-50" onClick={handleAdd} disabled={loading || newStock <= 0}>
                            {loading ? 'Guardando...' : 'Confirmar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}