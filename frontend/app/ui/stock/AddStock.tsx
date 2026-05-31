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
    if (!show) return null;

    const handleAdd = async () => {
        //Invocar la funcion para ingresar la cantidad en newStock del ingrediente ingredient
        onStockUpdate();//El parametro es el ingrediente con stock actualizado
        setNewStock(0);
        onClose();
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
                    <div className="flex justify-end m-1">
                        <button className="text-center rounded-lg" onClick={handleAdd}>Confirmar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}