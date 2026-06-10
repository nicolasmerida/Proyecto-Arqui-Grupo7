// app/ui/commands/command-mozo.tsx
'use client';
import { Comanda, Item_Pedido } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { HiOutlineClock } from "react-icons/hi";

interface CommandCardProps {
    command: Comanda;
}

export default function CommandMozo({command} : CommandCardProps) {
    const [items, setItems] = useState<Item_Pedido []>([]);
    const [total, setTotal] = useState<number>(0);


    //Consultar items de la comanda al backend
    const fetchItems = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items-pedido/comanda/${command.numeroComanda}`);
            
            if (!response.ok) {
                let errorMessage = `Error ${response.status} inesperado al consultar items de la comanda`;
                let errorCode = `ERROR_DESCONOCIDO`;
                try {
                    //Intento obtener el mensaje de error desde la API
                    const errorData = await response.json();
                    if (errorData?.error?.message) {
                        errorMessage = errorData.error.message;
                        errorCode = errorData.error.code || errorCode;
                    }
                }
                catch (e) {
                    //Se mantiene el mensaje de error por defecto
                }
                //Lanzo el error
                throw new Error(errorMessage, { cause: errorCode });
            }

            const data = await response.json();
            setItems(data);
        }
        catch (error) {
            console.error("Error al obtener los items de la comanda:", error);
        }
    };

    //Consultar valor total de la comanda al backend
    const fetchTotal = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comandas/${command.numeroComanda}/total`);
            
            if (!response.ok) {
                let errorMessage = `Error ${response.status} inesperado al obtener importe total de la comanda`;
                let errorCode = `ERROR_DESCONOCIDO`;
                try {
                    //Intento obtener el mensaje de error desde la API
                    const errorData = await response.json();
                    if (errorData?.error?.message) {
                        errorMessage = errorData.error.message;
                        errorCode = errorData.error.code || errorCode;
                    }
                }
                catch (e) {
                    //Se mantiene el mensaje de error por defecto
                }
                //Lanzo el error
                throw new Error(errorMessage, { cause: errorCode });
            }

            const data = await response.json();
            setTotal(data);
        }
        catch (error) {
            console.error("Error al obtener el importe total:", error);
        }
    };

    useEffect(() => {
        fetchItems();  
        fetchTotal();      
    }, []);

    return (
        <div className="flex flex-row py-0.5">
            <div className="flex justify-between content-center">
                <div className="flex space-x-0.5">
                    <div className="text-lg text-black">
                        Mesa N°{command.mesa.numeroMesa}
                    </div>
                    <div className="text-sm text-gray-400">
                        #{command.numeroComanda}
                    </div>
                </div>
                <div className="flex flex-row space-x-0.5">
                    <HiOutlineClock />
                    {/* Tiempo activa */}
                </div>
            </div>
            <div className="flex justify-between content-center">
                <div className="rounded-xl">
                    {command.estadoComanda}
                </div>
                <div className="font-bold text-black">
                    ${total}
                </div>
            </div>
            <div className="text-sm text-gray-400 justify-items-start">
                {items.length} • {command.mozo.nombre}
            </div>
        </div>
    );
}