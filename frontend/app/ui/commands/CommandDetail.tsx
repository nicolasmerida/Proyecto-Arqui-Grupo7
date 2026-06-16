// app/ui/commands/CommandDetail.tsx
import { Item_Pedido } from "@/app/lib/definitions";
import { HiOutlineCheck, HiOutlineTrash } from "react-icons/hi";

interface CommandDetailProps {
    items: Item_Pedido[];
    onConfirm: () => void;
    isSubmitting: boolean;
}

export default function CommandDetail({ items, onConfirm, isSubmitting }: CommandDetailProps) {
    const total = items.reduce((acc, item) => acc + (item.plato.precio * item.cantidad), 0);

    return (
        <div className="flex flex-col w-80 bg-white border-l border-slate-200 h-screen sticky top-0 p-4 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b">
                Pedido Actual
            </h2>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {items.length === 0 ? (
                    <div className="text-center text-slate-500 italic mt-10">
                        No hay platos en la comanda todavía.
                    </div>
                ) : (
                    items.map((item, index) => (
                        <div key={index} className="flex flex-col p-3 border rounded-lg bg-slate-50 gap-1">
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-slate-800">{item.cantidad}x {item.plato.nombre}</span>
                                <span className="text-slate-600 font-medium">${item.plato.precio * item.cantidad}</span>
                            </div>
                            {item.notas && (
                                <div className="text-xs text-slate-500 italic border-t pt-1 mt-1">
                                    Nota: {item.notas}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-slate-700">Total:</span>
                    <span className="text-2xl font-bold text-slate-900">${total}</span>
                </div>

                <button
                    onClick={onConfirm}
                    disabled={items.length === 0 || isSubmitting}
                    className="w-full py-3 flex items-center justify-center gap-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
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