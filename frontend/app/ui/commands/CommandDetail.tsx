// app/ui/commands/CommandDetail.tsx
import { Item_Pedido } from "@/app/lib/definitions";
import { HiOutlineCheck } from "react-icons/hi";
import ItemCard from "./item-card";

interface CommandDetailProps {
    items: Item_Pedido[];
    onConfirm: () => void;
    isSubmitting: boolean;
    onUpdateQuantity: (index: number, delta: number) => void;
    onRemoveItem: (index: number) => void;
    onEditItem: (index: number) => void;
}

export default function CommandDetail({ items, onConfirm, isSubmitting, onUpdateQuantity, onRemoveItem, onEditItem }: CommandDetailProps) {
    const total = items.reduce((acc, item) => acc + ((item.precio || 0) * item.cantidad), 0);

    return (
        <div className="flex flex-col w-[380px] bg-[#F9F6EE] border-l border-[#EBE5D9] h-screen sticky top-0 shadow-sm font-sans">
            <div className="p-6 border-b border-[#EBE5D9]">
                <h2 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
                    Pedido Actual
                </h2>
                <p className="text-sm text-gray-500 mt-1">Platos para agregar a la mesa</p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-2">
                {items.length === 0 ? (
                    <div className="text-center text-gray-400 italic mt-10">
                        No hay platos en la comanda todavía.
                    </div>
                ) : (
                    <div>
                        {items.map((item, index) => (
                            <ItemCard 
                                key={index} 
                                item={item} 
                                onIncrement={() => onUpdateQuantity(index, 1)}
                                onDecrement={() => onUpdateQuantity(index, -1)}
                                onDelete={() => onRemoveItem(index)}
                                onEdit={() => onEditItem(index)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="p-6 bg-[#F9F6EE] border-t border-[#EBE5D9] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center mb-5">
                    <span className="font-bold text-gray-600">Total:</span>
                    <span className="text-3xl font-bold text-gray-900">${total.toLocaleString('es-AR')}</span>
                </div>

                <button
                    onClick={onConfirm}
                    disabled={items.length === 0 || isSubmitting}
                    className="w-full py-3.5 flex items-center justify-center gap-2 bg-green-600 text-white font-bold text-lg rounded-xl shadow-sm hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span>Enviando...</span>
                    ) : (
                        <>
                            <HiOutlineCheck className="text-xl" /> Enviar a Cocina
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}