// app/user/mozo/menu/page.tsx
'use client';

import { Item_Pedido, Plato } from "@/app/lib/definitions";
import Menu from "@/app/menu/page";
import { useState } from "react";

type SearchParams = {
  page?: string; 
};
type MozoProps = {
  searchParams?: Promise<SearchParams>; 
};

export default async function MozoMenu({ searchParams }: MozoProps) {
    const resolvedParams = await searchParams;
    const [itemsComanda, setItemsComanda] = useState<Item_Pedido[]>([]); //Lista de platos seleccionados para la comanda actual

    const agregarItem = (plato: Plato) => {
        setItemsComanda((prev) => {
            // Verificar si el plato ya está en la comanda
            const existe = prev.find((item) => item.plato.id === plato.id);
            if (existe) {   //Si el plato esta en la comanda, incrementar la cantidad
            }
            //Si el plato no esta en la comanda, agregar nuevo item a la comanda
            return [];
        })
    }

    return (
        <div className="flex flex-row">
            <Menu searchParams={resolvedParams} editable={false} selectionable={true} />
            {/* Mostrar comanda con los platos seleccionados */}
        </div>
    );
}