// app/ui/mozo/plano-salon.tsx
import { useState } from "react";

export default function PlanoSalon() {
    const [vistaSalon, setVistaSalon] = useState(true);
    const [vistaTerraza, setVistaTerraza] = useState(true);

    return (
        <div className="flex flex-col">
            <div className="flex flex-col">
                    <span className="text-xl text-white font-serif">Plano del salon</span>
                    <span className="text-sm text-gray-400">
                        {/* Cant mesas ocupadas */} ocupadas - {/* Cant mesas libres */} libres
                    </span>
            </div>
            {(vistaSalon) && (
                <div className="flex flex-col my-1">
                    <div className="flex flex-row items-center">
                        <span className="text-base text-white font-serif">Salón</span>&nbsp;
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
                    <div className="flex flex-row items-center">
                        <span className="text-base text-white font-serif">Terraza</span>&nbsp;
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