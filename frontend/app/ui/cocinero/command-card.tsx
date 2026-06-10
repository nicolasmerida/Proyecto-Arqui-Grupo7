// app/ui/Cocinero/command-car.tsx
import { Comanda, EstadoComanda, EstadoItem, Item_Pedido } from "@/app/lib/definitions";
import { HiOutlineArrowSmRight, HiOutlineCheck, HiOutlineClock, HiOutlineX } from "react-icons/hi";

type CommandProps = {
    command?: Comanda;
    state?: EstadoComanda;
}

export default function CommandCard({command, state} : CommandProps) {
    const items : Item_Pedido[] = []; //Consultar items de la comanda desde el backend

    // Cambia el estado de un item de la comanda
    const cambiarEstado = async (item: Item_Pedido, nuevo: EstadoItem) => {
        await fetch(`${process.env.BACKEND_URL}/api/items-pedido/estado=${nuevo}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ estado: nuevo, }),
        });
    }

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