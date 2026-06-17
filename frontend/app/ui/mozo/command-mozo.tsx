// app/ui/commands/command-mozo.tsx
'use client';
import { ComandaResumen, Item_Pedido } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { HiOutlineClock } from "react-icons/hi";

interface CommandCardProps {
    command: ComandaResumen;
    onSelect: (items: Item_Pedido[], total: number) => void;
}

export default function CommandMozo({ command, onSelect }: CommandCardProps) {
    const [items, setItems] = useState<Item_Pedido[]>([]);
    const [total, setTotal] = useState<number>(0);

    const fetchItems = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items-pedido/comanda/${command.numeroComanda}`);
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error("Error al obtener los items:", error);
        }
    };

    const fetchTotal = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comandas/${command.numeroComanda}/total`);
            if (!response.ok) throw new Error(`Error ${response.status}`);
            const data = await response.json();
            setTotal(data);
        } catch (error) {
            console.error("Error al obtener el total:", error);
        }
    };

    useEffect(() => {
        fetchItems();
        fetchTotal();
    }, []);

    return (
        <div className="flex flex-col p-3 gap-1 cursor-pointer" onClick={() => onSelect(items, total)}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                    <span className="text-lg text-black">Mesa N°{command.mesa?.numeroMesa || '?'}</span>
                    <span className="text-sm text-gray-400">#{command.numeroComanda}</span>
                </div>
                <HiOutlineClock className="text-gray-400" />
            </div>
            <div className="flex justify-between items-center">
                <span className="rounded-xl text-sm">{command.estadoComanda}</span>
                <span className="font-bold text-black">${total}</span>
            </div>
            <div className="text-sm text-gray-400">{items.length} items</div>
        </div>
    );
}