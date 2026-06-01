// app/ui/admin/TopSales.tsx
'use client';
import { Plato } from "@/app/lib/definitions";
import { useState } from "react";

export default function TopSales() {
    //Consultar top de ventas y cantidades al backend
    const [items, setItems] = useState<Plato[]>([]);
    const max = Math.max(...items.map(p => p.cantidad));

    return (
        <div className="flex flex-col border m-2">
            <div className="flex flex-col m-2">
                <span className="text-black text-lg font-serif">Más vendidos</span>
                <span className="text-gray-400 text-base">Top 5</span>
            </div>
            <div className="space-y-2">
                {items.map((item, index) => {
                    const porcentaje = (item.cantidad / max) * 100;

                    return (
                        <div className="flex flex-col gap-1" key={index}>
                            <div className="flex justify-between">
                                <div className="gap-1">
                                    <span className="italic text-gray-400">{index+1}.</span>
                                    <span className="text-black">{item.nombre}</span>
                                </div>
                                <span>{item.cantidad}</span>
                            </div>
                            {/* Barra */}
                            <div className="h-3 w-full rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${porcentaje}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}