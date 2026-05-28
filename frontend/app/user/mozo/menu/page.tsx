// app/user/mozo/menu/page.tsx
'use client';

import { EstadoItem, Item_Pedido, Plato } from "@/app/lib/definitions";
import Menu from "@/app/menu/page";
import CommandDetail from "@/app/ui/commands/CommandDetail";
import { useState } from "react";

type SearchParams = {
  page?: string;
  comanda?: string;
};
type MozoProps = {
  searchParams?: SearchParams; 
};

export default function MozoMenu({ searchParams }: MozoProps) {
    const numeroComanda = Number(searchParams?.comanda);
    const [itemsComanda, setItemsComanda] = useState<Item_Pedido[]>([]); //Lista de platos seleccionados para la comanda actual

    const agregarItem = (plato: Plato, nota?: string) => {
        const notas = nota ?? "";

        setItemsComanda((prev) => {
            // Verificar si el plato ya está en la comanda con las mismas notas
            const index = prev.findIndex((item) => item.nComanda === numeroComanda && item.plato.id === plato.id && item.notas.trim() === notas.trim());
            if (index !== -1) {   //Si el plato esta en la comanda, incrementar la cantidad
                return prev.map((item, i) =>
                    (i === index) ?
                    {
                        ...item,
                        cant: item.cant + 1,
                    } :
                    item
                );
            }
            //Si el plato no esta en la comanda, agregar nuevo item a la comanda
            return [...prev, {
                id: prev.length, cant: 1, notas, estado: EstadoItem.Pendiente, nComanda: numeroComanda, plato: plato
            }];
        })
    }

    return (
        <div className="flex flex-row"> {/* Agregar margen superior segun Userbar */}
            <Menu searchParams={searchParams} editable={false} selectionable={true} addItem={agregarItem} />
            <CommandDetail items={itemsComanda} />
        </div>
    );
}