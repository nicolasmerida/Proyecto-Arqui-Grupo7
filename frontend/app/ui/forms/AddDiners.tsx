// app/ui/forms/AddDiner.tsx
import { Mesa } from "@/app/lib/definitions";
import { type FormEvent } from "react";
import { HiOutlineXCircle } from "react-icons/hi";

interface AddDinerProps {
    mesa: Mesa;
    comensales: number;
    setComensales: (value: number) => void;
    onClose: () => void;
    onSubmit: () => Promise<void>;
    cargando: boolean;
}

export default function AddDiner({ mesa, comensales, setComensales, onClose, onSubmit, cargando }: AddDinerProps) {
    const handleSubmitComensales = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await onSubmit();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Abrir mesa #{mesa.numeroMesa}</h2>
                        <p className="text-sm text-slate-500">Ingrese la cantidad de comensales para la mesa.</p>
                    </div>
                    <button type="button" className="rounded-full bg-slate-200 px-3 py-1 text-sm" onClick={onClose}>
                        <HiOutlineXCircle />
                    </button>
                </div>

                <form onSubmit={handleSubmitComensales} className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700">
                        Comensales
                        <input
                            type="number"
                            min={1}
                            max={mesa.capacidad}
                            value={comensales}
                            onChange={(e) => setComensales(Number(e.target.value))}
                            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-amber-400 focus:outline-none"
                            required
                        />
                    </label>

                    <div className="flex items-center justify-between gap-3">
                        <button type="button" onClick={onClose} className="rounded-xl border border-slate-300 px-4 py-2 text-slate-700">
                            Cancelar
                        </button>
                        <button type="submit" className="rounded-xl bg-amber-400 px-4 py-2 font-semibold text-white shadow-sm hover:bg-amber-500" disabled={cargando}>
                            {cargando ? 'Abriendo...' : 'Abrir mesa'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}