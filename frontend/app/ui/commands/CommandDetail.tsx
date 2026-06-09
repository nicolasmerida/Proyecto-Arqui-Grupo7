// app/ui/commands/CommandDetail.tsx
'use client';
import { Item_Pedido } from "@/app/lib/definitions";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { useState } from "react";

interface CommandDetailProps {
    items: Item_Pedido[];
    numeroComanda: number;
    onConfirmed: () => void;
}

export default function CommandDetail({ items, numeroComanda, onConfirmed }: CommandDetailProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const total = items.reduce(
        (acc, item) => acc + Number(item.plato.precio) * item.cantidad,
        0
    );

    const handleConfirmar = async () => {
        if (items.length === 0) return;
        setLoading(true);
        setError(null);
        try {
            for (const item of items) {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items-pedido`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(item),
                    }
                );
                if (!res.ok) {
                    setError('Error al enviar uno o más ítems. Intentá de nuevo.');
                    return;
                }
            }
            onConfirmed();
        } catch {
            setError('No se pudo conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-72 min-w-[18rem] border rounded-xl p-4 bg-white shadow-md text-black self-start sticky top-4">
            <h2 className="text-lg font-semibold mb-3">
                Comanda <span className="font-mono text-gray-500">#{numeroComanda}</span>
            </h2>

            {items.length === 0 ? (
                <p className="text-gray-400 text-sm italic flex-1">
                    Seleccioná platos del menú para agregarlos.
                </p>
            ) : (
                <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-96">
                    {items.map(item => (
                        <div
                            key={`${item.id.numeroComanda}-${item.id.idPlato}`}
                            className="flex justify-between items-start text-sm border-b pb-2"
                        >
                            <div className="flex flex-col flex-1 mr-2">
                                <span className="font-medium">{item.plato.nombre}</span>
                                {item.notas && (
                                    <span className="text-xs text-gray-400 italic">{item.notas}</span>
                                )}
                            </div>
                            <div className="text-right shrink-0">
                                <span className="font-semibold">x{item.cantidad}</span>
                                <p className="text-gray-500">
                                    ${(Number(item.plato.precio) * item.cantidad).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="border-t mt-3 pt-3">
                <div className="flex justify-between font-bold text-base mb-3">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                {error && (
                    <div className="flex items-center gap-1 text-red-500 text-xs mb-2">
                        <HiOutlineXCircle /> {error}
                    </div>
                )}
                <button
                    onClick={handleConfirmar}
                    disabled={loading || items.length === 0}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-black text-white rounded-xl text-sm disabled:opacity-40 hover:bg-gray-800 transition"
                >
                    <HiOutlineCheckCircle className="text-lg" />
                    {loading ? 'Enviando pedido...' : 'Confirmar pedido'}
                </button>
            </div>
        </div>
    );
}
