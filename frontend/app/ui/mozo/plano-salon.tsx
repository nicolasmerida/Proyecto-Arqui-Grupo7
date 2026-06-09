// app/ui/mozo/plano-salon.tsx
'use client';
import { EstadoMesa, Mesa } from "@/app/lib/definitions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Vista = "todos" | "salon" | "terraza";

export default function PlanoSalon() {
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [vista, setVista] = useState<Vista>("todos");
    const [mesaSeleccionada, setMesaSeleccionada] = useState<Mesa | null>(null);
    const [comensales, setComensales] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mesas`)
            .then(res => res.json())
            .then(setMesas)
            .catch(console.error);
    }, []);

    const mesasPorSector = (sector: string) =>
        mesas.filter(m => m.sector?.toLowerCase() === sector.toLowerCase());

    const ocupadas = mesas.filter(m => m.estadoMesa === EstadoMesa.Ocupada).length;
    const libres   = mesas.filter(m => m.estadoMesa === EstadoMesa.Libre).length;

    const handleMesaClick = (mesa: Mesa) => {
        if (mesa.estadoMesa !== EstadoMesa.Libre) return;
        setMesaSeleccionada(mesa);
        setComensales(1);
        setError(null);
    };

    const handleConfirmar = async () => {
        if (!mesaSeleccionada || comensales < 1) return;
        setLoading(true);
        setError(null);
        try {
            const abrirRes = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mesas/${mesaSeleccionada.numeroMesa}/abrir?numeroComensales=${comensales}`,
                { method: 'PUT' }
            );
            if (!abrirRes.ok) {
                setError('No se pudo abrir la mesa.');
                return;
            }
            const comandaRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comandas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    estadoComanda: 'ABIERTA',
                    mesa: { numeroMesa: mesaSeleccionada.numeroMesa },
                }),
            });
            if (!comandaRes.ok) {
                setError('No se pudo crear la comanda.');
                return;
            }
            const comanda = await comandaRes.json();
            setMesas(prev => prev.map(m =>
                m.numeroMesa === mesaSeleccionada.numeroMesa
                    ? { ...m, estadoMesa: EstadoMesa.Ocupada }
                    : m
            ));
            setMesaSeleccionada(null);
            router.push(`/user/mozo/menu?comanda=${comanda.numeroComanda}`);
        } catch {
            setError('Error al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    const renderMesas = (listaMesas: Mesa[]) => {
        if (listaMesas.length === 0) {
            return <p className="text-gray-400 text-sm italic ml-1">Sin mesas en este sector.</p>;
        }
        return (
            <div className="grid grid-cols-4 gap-2 m-1">
                {listaMesas.map(mesa => {
                    const libre = mesa.estadoMesa === EstadoMesa.Libre;
                    return (
                        <button
                            key={mesa.numeroMesa}
                            onClick={() => handleMesaClick(mesa)}
                            disabled={!libre}
                            title={libre ? 'Abrir mesa' : 'Mesa ocupada'}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 text-sm font-medium transition-all
                                ${libre
                                    ? 'border-green-400 bg-green-50 text-green-800 hover:bg-green-100 cursor-pointer'
                                    : 'border-red-300 bg-red-50 text-red-700 cursor-not-allowed opacity-70'
                                }`}
                        >
                            <span className="font-bold text-lg">{mesa.numeroMesa}</span>
                            <span className="text-xs">{libre ? 'Libre' : 'Ocupada'}</span>
                            <span className="text-xs text-gray-400">{mesa.capacidad} pers.</span>
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <>
        <div className="flex flex-col">
            <div className="flex flex-row justify-between mb-2">
                <div className="flex flex-col">
                    <span className="text-xl text-white font-serif">Plano del salón</span>
                    <span className="text-sm text-gray-400">
                        {ocupadas} ocupadas · {libres} libres
                    </span>
                </div>
                <div className="flex gap-1 items-center">
                    {(['todos', 'salon', 'terraza'] as Vista[]).map(v => (
                        <button
                            key={v}
                            onClick={() => setVista(v)}
                            className={`border rounded-lg px-2 py-1 text-sm capitalize transition
                                ${vista === v ? 'bg-white text-black' : 'text-white'}`}
                        >
                            {v === 'salon' ? 'Salón' : v.charAt(0).toUpperCase() + v.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {(vista === "salon" || vista === "todos") && (
                <div className="flex flex-col my-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-base text-white font-serif italic">Salón</span>
                        <span className="text-sm text-gray-300">— {mesasPorSector("salon").length} mesas</span>
                    </div>
                    {renderMesas(mesasPorSector("salon"))}
                </div>
            )}

            {(vista === "terraza" || vista === "todos") && (
                <div className="flex flex-col my-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-base text-white font-serif italic">Terraza</span>
                        <span className="text-sm text-gray-300">— {mesasPorSector("terraza").length} mesas</span>
                    </div>
                    {renderMesas(mesasPorSector("terraza"))}
                </div>
            )}
        </div>

        {mesaSeleccionada && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-6 w-80 shadow-xl text-black">
                    <h2 className="text-lg font-semibold mb-1">
                        Abrir Mesa {mesaSeleccionada.numeroMesa}
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Capacidad máxima: {mesaSeleccionada.capacidad} personas
                    </p>
                    <label className="text-sm text-gray-600 mb-1 block">
                        Cantidad de comensales
                    </label>
                    <input
                        type="number"
                        min={1}
                        max={mesaSeleccionada.capacidad}
                        value={comensales}
                        onChange={e => setComensales(Number(e.target.value))}
                        className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => setMesaSeleccionada(null)}
                            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirmar}
                            disabled={loading || comensales < 1 || comensales > mesaSeleccionada.capacidad}
                            className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
                        >
                            {loading ? 'Abriendo...' : 'Confirmar'}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}
