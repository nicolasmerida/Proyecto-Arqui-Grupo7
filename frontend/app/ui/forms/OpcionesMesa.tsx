// app/ui/forms/OpcionesMesa.tsx
import { Mesa } from "@/app/lib/definitions";
import { HiOutlineXCircle } from "react-icons/hi";

interface OpcionesMesaProps {
    mesa: Mesa;
    comandaId: number;
    total: string;
    items: any[];
    onClose: () => void;
    onAgregarPlatos: () => void;
    cargando: boolean;
}

export default function OpcionesMesa({ mesa, comandaId, total, items, onClose, onAgregarPlatos, cargando }: OpcionesMesaProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl text-black">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Mesa #{mesa.numeroMesa} (Ocupada)</h2>
                        <p className="text-sm text-slate-500">Comanda #{comandaId}</p>
                    </div>
                    <button type="button" className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700" onClick={onClose}>
                        <HiOutlineXCircle className="text-xl" />
                    </button>
                </div>

                {/* Resumen de pedido */}
                {items && items.length > 0 ? (
                    <div className="mb-4 max-h-32 overflow-y-auto border rounded-lg p-2 bg-gray-50 text-sm">
                        <ul className="divide-y divide-gray-200">
                            {items.map((item, idx) => (
                                <li key={idx} className="flex justify-between py-1">
                                    <span className="text-gray-700">
                                        {item.cantidad}x {item.nombrePlato || `Plato #${item.idPlato}`}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="mb-4 text-center text-sm text-gray-500 italic">
                        La mesa aún no ha pedido platos.
                    </div>
                )}

                <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-xl mb-6">
                    <span className="text-sm text-gray-500 font-medium">Total acumulado</span>
                    <span className="text-3xl font-bold text-green-600">${total}</span>
                </div>

                <div className="flex flex-col gap-3">
                    <button 
                        type="button" 
                        onClick={onAgregarPlatos}
                        className="w-full rounded-xl border border-amber-400 bg-amber-50 px-4 py-3 font-semibold text-amber-600 shadow-sm hover:bg-amber-100 transition-colors"
                        disabled={cargando}
                    >
                        Agregar más platos
                    </button>

                    <p className="text-xs text-center text-gray-400 italic">
                        El cobro se realiza desde la comanda, una vez entregado el pedido.
                    </p>
                </div>
            </div>
        </div>
    );
}