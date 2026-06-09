// app/ui/commands/command-mozo.tsx
import { Comanda } from "@/app/lib/definitions";
import { HiOutlineClock } from "react-icons/hi";

interface CommandCardProps {
    command: Comanda;
}

export default function CommandMozo({command} : CommandCardProps) {

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
                    ${/* Precio total comanda */}
                </div>
            </div>
            <div className="text-sm text-gray-400 justify-items-start">
                {/* Cant items total */} • {command.mozos[0]?.nombre ?? 'Sin mozo'}
            </div>
        </div>
    );
}