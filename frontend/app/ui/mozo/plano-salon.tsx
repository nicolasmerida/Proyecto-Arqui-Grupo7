// app/ui/mozo/plano-salon.tsx
'use client';

export default function PlanoSalon() {

    return (
        <div className="flex flex-col">
            <div className="flex flex-col">
                <span className="text-xl text-white font-serif italic">Plano del salon</span>
                <span className="text-sm text-gray-300">
                    {/* Cant mesas ocupadas */} ocupadas - {/* Cant mesas libres */} libres
                </span>
            </div>
            <div className="grid grid-cols-4 gap-2 m-1">
                {/* Cuadricula con las mesas y sus números
                    Tienen que ser botones que generen una nueva comanda para esa mesa */}
            </div>
        </div>
    );
}