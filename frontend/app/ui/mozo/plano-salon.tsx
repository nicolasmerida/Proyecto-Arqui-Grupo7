// app/ui/mozo/plano-salon.tsx
import { useState } from "react";

export default function PlanoSalon() {
    const [vistaSalon, setVistaSalon] = useState(true);
    const [vistaTerraza, setVistaTerraza] = useState(true);

    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <span className="text-xl text-black font-serif">Plano del salon</span>
                    <span className="text-sm text-gray-400">
                        {/* Cant mesas ocupadas */} ocupadas - {/* Cant mesas libres */} libres
                    </span>
                </div>
            </div>
            {(vistaSalon) && (
                <div className="flex flex-col my-1">
                    <div className="flex flex-row">
                        <span className="text-base text-black font-serif">Salón</span>
                        <span className="text-sm text-gray-300"> - {/* Cant mesas salon */}</span>
                    </div>
                    <div className="flex flex-col">
                        {/* Cuadricula con las mesas y sus números
                            Tienen que ser botones que generen una nueva comanda para esa mesa */}
                    </div>
                </div>
            )}
            {(vistaTerraza) && (
                <div className="flex flex-col my-1">
                    <div className="flex flex-row">
                        <span className="text-base text-black font-serif">Terraza</span>
                        <span className="text-sm text-gray-300"> - {/* Cant mesas terraza */}</span>
                    </div>
                    <div className="flex flex-col">
                        {/* Cuadricula con las mesas y sus números
                            Tienen que ser botones que generen una nueva comanda para esa mesa */}
                    </div>
                </div>
            )}
        </div>
    );
}