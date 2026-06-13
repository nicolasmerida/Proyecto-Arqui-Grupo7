// app/ui/Cocinero/command-cocinero.tsx
'use client';
import { Comanda, EstadoComanda, EstadoItem, Item_Pedido } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { HiOutlineArrowSmRight, HiOutlineCheck, HiOutlineClock, HiOutlineX } from "react-icons/hi";

type CommandProps = {
    command?: Comanda;
    state?: EstadoComanda;
}

export default function CommandCocinero({command, state} : CommandProps) {
    const [items, setItems]= useState<Item_Pedido[]>([]); //Consultar items de la comanda desde el backend

    // Cambia el estado de un item de la comanda
    const cambiarEstado = async (item: Item_Pedido, nuevo: EstadoItem) => {
        // Pensar cómo indico cuál es el item/comanda que cambia
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items-pedido/estado=${nuevo}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ estado: nuevo, }),
        });
    }

    //Consultar items de la comanda al backend
    useEffect(() => {
        const fetchItems = async () => {
        try {
            //Ajustar URL de la API
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items-pedido/comanda/${command?.numeroComanda}`)
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

        fetchItems();
    }, [])

    return(
        <div className="flex flex-col rounded-md">
            <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-1">
                    <h1 className="items-center"><strong>Mesa {command?.mesa.numeroMesa}</strong></h1>
                    <span className="items-start">#{command?.numeroComanda}</span>
                </div>
                <div>
                    <HiOutlineClock />
                    {/* Tiempo activa */}
                </div>
            </div>
            <div className="text-gray-500">
                Mozo: {command?.mozo.nombre}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-md gap-12">
                {
                    items.map((item) => (
                        <div className="flex flex-col items-center m-1 gap-1">
                            <div className="rounded-md items-center bg-white text-black">{item.cantidad}</div>
                            <span className="items-center text-black">{item.plato.nombre}</span>
                            <button className="rounded-md" onClick={() => cambiarEstado(item, EstadoItem.Preparacion)}>
                                {(state === EstadoComanda.Abierta) ? <HiOutlineArrowSmRight /> : (
                                    (state === EstadoComanda.Preparacion) ? <HiOutlineCheck /> : (
                                    (state === EstadoComanda.Lista) ? <HiOutlineArrowSmRight /> : <HiOutlineX />
                                    ))
                                }
                            </button>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}