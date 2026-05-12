// app/ui/Cocinero/command-car.tsx
import { Comanda, Plato } from "@/app/lib/definitions";
import { HiOutlineClock } from "react-icons/hi";

type CommandProps = {
    command?: Comanda;
}

export default function CommandCard({command} : CommandProps) {
    const platos : Plato[] = []; //Consultar platos de la comanda desde el backend

    return(
        <div className="flex flex-col rounded-md">
            <div className="flex flex-row justify-between">
                <div>
                    <h1><strong>N° mesa</strong></h1>
                    N° comanda
                </div>
                <div>
                    <HiOutlineClock />
                    {/* Tiempo activa */}
                </div>
            </div>
            <div className="text-gray-500">
                Mozo: {/* Mozo a cargo */}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-md gap-12">
                {
                    platos.map((plato) => (
                        <div>Detalles de cada plato de la comanda</div>
                    ))
                }
            </div>
        </div>
    );
}