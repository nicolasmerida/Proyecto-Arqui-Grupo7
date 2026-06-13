// app/ui/stock/AddStock.tsx
'use client';
import { Ingrediente } from "@/app/lib/definitions";
import { useState } from "react";
import { HiOutlineArrowSmRight, HiOutlineXCircle } from "react-icons/hi";

interface AddStockProps {
    show: boolean;
    onClose: () => void;
    onStockUpdate: (ing: Ingrediente) => void;
    ingredient: Ingrediente | undefined;
};

export default function AddStock({ show, onClose, onStockUpdate, ingredient} : AddStockProps) {
    const [newStock, setNewStock] = useState<number>(0);
    if (!show || !ingredient) return null;

    const handleAdd = async () => {
        //Invocar la funcion para ingresar la cantidad en newStock del ingrediente ingredient
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ingredientes/${ingredient?.idIngrediente}/stock?cantidad=${newStock}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) {
                let errorMessage = `Error ${response.status} inesperado al actualizar el stock de un ingrediente`;
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
            onStockUpdate(data);//El parametro es el ingrediente con stock actualizado
            setNewStock(0);
            onClose();
        }
        catch (error) {
            console.error("Error al actualizar el stock de un ingrediente:", error);
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
                        <span className="text-gray-800 text-lg">Cantidad ({ingredient.unidad})</span>
                        <input
                            type="number"
                            min={0}
                            placeholder={`0 ${ingredient.unidad}`}
                            value={newStock}
                            onChange={(e) => setNewStock(Number(e.target.value))}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div className="flex flex-col m-1">
                        <span className="text-base text-gray-500">Stock resultante</span>
                        <span className="font-serif text-xl text-black">
                            {ingredient.stock} <HiOutlineArrowSmRight /> {ingredient.stock + newStock}
                        </span>
                    </div>
                    <div className="flex justify-end gap-2 m-1">
                        <button className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600" onClick={handleAdd}>
                            Confirmar
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}