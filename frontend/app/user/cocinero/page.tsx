// app/user/cocinero/page.tsx
'use client';

import { Comanda, EstadoComanda } from "@/app/lib/definitions";
import CommandCard from "@/app/ui/cocinero/command-car";
import { useEffect, useState } from "react";

export default function Cocinero() {
  const [comandas, setComandas] = useState<Comanda[]>([]); //Consultar comandas desde el backend

  // Obtiene las comandas desde el backend
  const fetchComandas = async () => {
    const response = await fetch(); //Ajustar llamada al backend

    const data = await response.json();
    setComandas(data);
  }

  // Cambia el estado de una comanda y actualiza las comandas
  const cambiarEstado = async (numero: number, nuevo: EstadoComanda) => {
    await fetch(``, { //Ajustar llamada al backend
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado: nuevo, }),
    });

    // Actualizar comandas
    await fetchComandas();
  }

  // Recupera las comandas al comienzo y cada 5 segundos
  useEffect(() => {
    fetchComandas();

    const interval = setInterval(() => {
      fetchComandas();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const pendientes = comandas.filter((c) => c.estado === EstadoComanda.Pendiente); //Consultar comandas pendientes desde el backend
  const enPreparacion = comandas.filter((c) => c.estado === EstadoComanda.Preparacion); //Consultar comandas en preparación desde el backend
  const listos = comandas.filter((c) => c.estado === EstadoComanda.Lista); //Consultar comandas listas desde el backend

  return (
    <div className="flex flex-col flex-1 items-center justify-center">  {/* Agregar margen superior */}
      <div className="flex flex-row justify-between items-center border-amber-200 border-2 w-full">
        <div className="items-center rounded-sm px-2">
          Platos pendientes
          <div className="flex flex-col py-1">
            {
              pendientes.map((comanda) => (
                <CommandCard command={comanda} />
              ))
            }
          </div>
        </div>
        <div className="items-center rounded-sm px-2">
          En Preparación
          <div className="flex flex-col py-1">
            {
              enPreparacion.map((comanda) => (
                <CommandCard command={comanda} />
              ))
            }
          </div>
        </div>
        <div className="items-center rounded-sm px-2">
          Platos listos
          <div className="flex flex-col py-1">
            {
              listos.map((comanda) => (
                <CommandCard command={comanda} />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}