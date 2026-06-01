// app/ui/mozo/plano-salon.tsx
'use client';
import { useState } from "react";

export default function PlanoSalon() {
    const [vista, setVista] = useState("todos");

    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                        <span className="text-xl text-white font-serif">Plano del salon</span>
                        <span className="text-sm text-gray-400">
                            {/* Cant mesas ocupadas */} ocupadas - {/* Cant mesas libres */} libres
                        </span>
                </div>
                <div className="grid grid-cols-3 items-center">
                    <button className={`border rounded-lg transition ${vista === "todos" ? "text-white" : "text-black"}`}
                            onClick={() => {setVista("todos")}}>
                                Todos
                    </button>
                    <button className={`border rounded-lg transition ${vista === "salon" ? "text-white" : "text-black"}`}
                            onClick={() => {setVista("salon")}}>
                                Salón
                    </button>
                    <button className={`border rounded-lg transition ${vista === "terraza" ? "text-white" : "text-black"}`}
                            onClick={() => {setVista("terraza")}}>
                                Terraza
                    </button>
                </div>
            </div>
            {(vista === "salon" || vista === "todos") && (
                <div className="flex flex-col my-1">
                    <div className="flex flex-row items-center">
                        <span className="text-base text-white font-serif italic">Salón</span>&nbsp;
                        <span className="text-sm text-gray-300"> - {/* Cant mesas salon */}</span>
                    </div>
                    <div className="flex flex-col m-1">
                        {/* Cuadricula con las mesas y sus números
                            Tienen que ser botones que generen una nueva comanda para esa mesa */}
                    </div>
                </div>
            )}
            {(vista === "terraza" || vista === "todos") && (
                <div className="flex flex-col my-1">
                    <div className="flex flex-row items-center">
                        <span className="text-base text-white font-serif italic">Terraza</span>&nbsp;
                        <span className="text-sm text-gray-300"> - {/* Cant mesas terraza */}</span>
                    </div>
                    <div className="flex flex-col m-1">
                        {/* Cuadricula con las mesas y sus números
                            Tienen que ser botones que generen una nueva comanda para esa mesa */}
                    </div>
                </div>
            )}
        </div>
    );
}