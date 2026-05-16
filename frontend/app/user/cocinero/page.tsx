// app/user/cocinero/page.tsx
'use client';

import { Comanda, EstadoComanda } from "@/app/lib/definitions";
import CommandCard from "@/app/ui/cocinero/command-card";
import { useEffect, useState } from "react";
import { HiOutlineBell, HiOutlineCheck, HiOutlineFire } from "react-icons/hi";

export default function Cocinero() {
  const [comandas, setComandas] = useState<Comanda[]>([]);

  // Obtiene las comandas desde el backend
  const fetchComandas = async () => {
    const response = await fetch(`${process.env.BACKEND_URL}/api/comandas`);

    const data = await response.json();
    setComandas(data);
  }

  // Cambia el estado de una comanda y actualiza las comandas
  const cambiarEstado = async (numero: number, nuevo: EstadoComanda) => {
    await fetch(`${process.env.BACKEND_URL}/api/comandas/${numero}`, {
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

  //Separo las comandas según su estado
  const pendientes = comandas.filter((c) => c.estado === EstadoComanda.Pendiente);
  const enPreparacion = comandas.filter((c) => c.estado === EstadoComanda.Preparacion);
  const listos = comandas.filter((c) => c.estado === EstadoComanda.Lista);

  return (
    <div className="flex flex-col flex-1 items-center justify-center">  {/* Agregar margen superior segun Userbar */}
      <div className="flex flex-row justify-around items-center w-full m-10 p-5">
        <div className="items-center rounded-sm px-2 border-amber-200 border-2">
          Pendientes
          <div className="flex flex-col py-1">
            {
              pendientes.map((comanda) => (
                <div className="flex flex-col">
                  <CommandCard command={comanda} state={comanda.estado} />
                  <button className="rounded-md" onClick={() => cambiarEstado(comanda.numero_comanda, EstadoComanda.Preparacion)}>
                    <HiOutlineFire /> Empezar a preparar
                  </button>
                </div>
              ))
            }
          </div>
        </div>
        <div className="items-center rounded-sm px-2 border-amber-200 border-2">
          En Preparación
          <div className="flex flex-col py-1">
            {
              enPreparacion.map((comanda) => (
                <div className="flex flex-col">
                  <CommandCard command={comanda} />
                  <button className="rounded-md" onClick={() => cambiarEstado(comanda.numero_comanda, EstadoComanda.Lista)}>
                    <HiOutlineCheck /> Todo listo
                  </button>
                </div>
              ))
            }
          </div>
        </div>
        <div className="items-center rounded-sm px-2 border-amber-200 border-2">
          Listas
          <div className="flex flex-col py-1">
            {
              listos.map((comanda) => (
                <div className="flex flex-col">
                  <CommandCard command={comanda} />
                  <button className="rounded-md" onClick={() => cambiarEstado(comanda.numero_comanda, EstadoComanda.Lista)}>
                    <HiOutlineBell /> Listo para servir
                  </button>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}