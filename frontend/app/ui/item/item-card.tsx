// app/ui/commands/item-card.tsx
import { Item_Pedido } from "@/app/lib/definitions";
import { HiOutlineTrash, HiOutlinePencil } from "react-icons/hi";

interface ItemCardProps {
    item: Item_Pedido;
    onIncrement: () => void;
    onDecrement: () => void;
    onDelete: () => void;
    onEdit: () => void;
}

export default function ItemCard({ item, onIncrement, onDecrement, onDelete, onEdit }: ItemCardProps) {
    // Usamos item.nombrePlato e item.precio porque la definición de Item_Pedido es plana.
    const nombre = item.nombrePlato;
    const precioUnitario = item.precio || 0;
    const precioTotal = precioUnitario * item.cantidad;

    return (
        <div className="flex flex-row items-center justify-between p-3 mb-2 bg-white border rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-gray-100 rounded-md px-2 py-1">
                    <button onClick={onDecrement} className="text-gray-500 hover:text-black font-bold px-1">-</button>
                    <span className="font-semibold text-black min-w-4 text-center">{item.cantidad}</span>
                    <button onClick={onIncrement} className="text-gray-500 hover:text-black font-bold px-1">+</button>
                </div>
                <div className="flex flex-col justify-start">
                    <span className="text-base font-semibold text-black">{nombre}</span>
                    <span className="text-sm text-gray-500">${precioUnitario} c/u</span>
                </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
                <span className="text-lg font-bold text-black">${precioTotal}</span>
                <div className="flex gap-2">
                    <button onClick={onEdit} className="text-amber-500 hover:text-amber-700">
                        <HiOutlinePencil />
                    </button>
                    <button onClick={onDelete} className="text-red-500 hover:text-red-700">
                        <HiOutlineTrash />
                    </button>
                </div>
            </div>
        </div>
    );
}
