// app/user/mozo/page.tsx
'use client';

import { Comanda, EstadoComanda } from "@/app/lib/definitions";
import CommandDetailCard from "@/app/ui/mozo/command-detail";
import PlanoSalon from "@/app/ui/mozo/plano-salon";
import { useEffect, useState } from "react";

const colorByState: Record<EstadoComanda, string> = {
  [EstadoComanda.Cancelada]: "comanda-cancelada",
  [EstadoComanda.Cerrada]: "comanda-cerrada",
  [EstadoComanda.Entregada]: "comanda-entregada",
  [EstadoComanda.Lista]: "comanda-lista",
  [EstadoComanda.Pendiente]: "comanda-pendiente",
  [EstadoComanda.Preparacion]: "comanda-preparacion",
}

export default function Mozo() {
  const [comandas, setComandas] = useState<Comanda[]>([]);

  // Obtiene las comandas desde el backend
  const fetchComandas = async () => {
    const response = await fetch(`${process.env.BACKEND_URL}/api/comandas`);

    const data = await response.json();
    setComandas(data);
  }

  // Recupera las comandas al comienzo y cada 5 segundos
  useEffect(() => {
    fetchComandas();

    const interval = setInterval(() => {
      fetchComandas();
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-row flex-1 items-center p-2">  {/* Agregar margen superior segun Userbar */}
      <PlanoSalon />
      <div className="flex-col p-1">
        <div className="flex flex-row justify-between content-center">
          <div>
            Comandas
          </div>
          <div className="justify-center rounded-xl border">
            {comandas.length}
          </div>
        </div>
        <div className="flex flex-col py-1">
          {
            comandas.map((comanda) => (
              <div className={`flex flex-col border-l-4 ${colorByState[comanda.estado]}`}>
                <CommandDetailCard command={comanda} />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}