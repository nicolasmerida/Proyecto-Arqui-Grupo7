// app/ui/mozo/MozoMenuClient.tsx
'use client';
import { EstadoItem, Item_Pedido, Plato } from "@/app/lib/definitions";
import MenuList from "@/app/ui/menu/MenuList";
import CommandDetail from "@/app/ui/commands/CommandDetail";
import { useState } from "react";

interface MozoMenuClientProps {
    platos: Plato[];
    numeroComanda: number;
}

export default function MozoMenuClient({ platos, numeroComanda }: MozoMenuClientProps) {
    const [itemsComanda, setItemsComanda] = useState<Item_Pedido[]>([]);

    const agregarItem = (plato: Plato, nota?: string) => {
        const notas = nota ?? "";
        setItemsComanda(prev => {
            const idx = prev.findIndex(
                item => item.id.idPlato === plato.idPlato && item.notas.trim() === notas.trim()
            );
            if (idx !== -1) {
                return prev.map((item, i) =>
                    i === idx ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            }
            return [...prev, {
                id: { numeroComanda, idPlato: plato.idPlato },
                comanda: { numeroComanda },
                plato,
                cantidad: 1,
                notas,
                estadoItem: EstadoItem.Pendiente,
            }];
        });
    };

    const handleConfirmed = () => setItemsComanda([]);

    return (
        <div className="flex flex-row gap-4 p-4 h-full">
            <div className="flex-1 overflow-y-auto">
                <MenuList items={platos} addItem={agregarItem} />
            </div>
            <CommandDetail
                items={itemsComanda}
                numeroComanda={numeroComanda}
                onConfirmed={handleConfirmed}
            />
        </div>
    );
}
