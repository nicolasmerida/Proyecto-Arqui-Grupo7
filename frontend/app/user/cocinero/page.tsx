// app/user/cocinero/page.tsx
'use client';
import { Comanda, EstadoComanda } from "@/app/lib/definitions";
import CommandCard from "@/app/ui/cocinero/command-cocinero";
import { useEffect, useState } from "react";
import { HiOutlineBell, HiOutlineCheck, HiOutlineFire } from "react-icons/hi";

const colorByState: Record<EstadoComanda, string> = {
  [EstadoComanda.Abierta]: "comanda-abierta",
  [EstadoComanda.Cancelada]: "comanda-cancelada",
  [EstadoComanda.Cerrada]: "comanda-cerrada",
  [EstadoComanda.Entregada]: "comanda-entregada",
  [EstadoComanda.Lista]: "comanda-lista",
  [EstadoComanda.Preparacion]: "comanda-preparacion",
}

export default function Cocinero() {
  const [comandas, setComandas] = useState<Comanda[]>([]);

  // Obtiene las comandas desde el backend
  const fetchComandas = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comandas`);

    if (!response.ok) {
      let errorMessage = `Error ${response.status} inesperado al consultar las comandas`;
      let errorCode = `ERROR_DESCONOCIDO`;
      try {
        //Intento obtener el mensaje de error desde la API
        const errorData = await response.json();
        if (errorData?.error?.message) {
          errorMessage = errorData.error.message;
          errorCode = errorData.error.code || errorCode;
        }
      }
      catch (e) {
        //Se mantiene el mensaje de error por defecto
      }
      //Lanzo el error
      throw new Error(errorMessage, { cause: errorCode });
    }

    const data = await response.json();
    setComandas(data);
  }

  // Cambia el estado de una comanda y actualiza las comandas
  const cambiarEstado = async (numero: number, nuevo: EstadoComanda) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comandas/${numero}/estado?nuevoEstado=${nuevo}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      let errorMessage = `Error ${response.status} inesperado al cambiar el estado de una comanda`;
      let errorCode = `ERROR_DESCONOCIDO`;
      try {
        //Intento obtener el mensaje de error desde la API
        const errorData = await response.json();
        if (errorData?.error?.message) {
          errorMessage = errorData.error.message;
          errorCode = errorData.error.code || errorCode;
        }
      }
      catch (e) {
        //Se mantiene el mensaje de error por defecto
      }
      //Lanzo el error
      throw new Error(errorMessage, { cause: errorCode });
    }
    // Actualizar comandas
    await fetchComandas();
  }

  // Recupera las comandas al comienzo y cada 5 segundos
  useEffect(() => {
    fetchComandas();

    const interval = setInterval(() => {
      fetchComandas();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  //Separo las comandas según su estado
  const pendientes = comandas.filter((c) => c.estadoComanda === EstadoComanda.Abierta);
  const enPreparacion = comandas.filter((c) => c.estadoComanda === EstadoComanda.Preparacion);
  const listos = comandas.filter((c) => c.estadoComanda === EstadoComanda.Lista);

  return (
    <div className="flex flex-col flex-1 items-center justify-center">  {/* Agregar margen superior segun Userbar */}
      <div className="flex flex-row justify-around items-center w-full m-10 p-5">
        <div className="items-center rounded-sm px-2 comanda-pendiente border-2">
          Pendientes
          <div className="flex flex-col py-1">
            {
              pendientes.map((comanda) => (
                <div className={`flex flex-col border-y-4 ${colorByState[comanda.estadoComanda]}`}>
                  <CommandCard command={comanda} />
                  <button className="rounded-md" onClick={() => cambiarEstado(comanda.numeroComanda, EstadoComanda.Preparacion)}>
                    <HiOutlineFire /> Empezar a preparar
                  </button>
                </div>
              ))
            }
          </div>
        </div>
        <div className="items-center rounded-sm px-2 comanda-preparacion border-2">
          En Preparación
          <div className="flex flex-col py-1">
            {
              enPreparacion.map((comanda) => (
                <div className="flex flex-col">
                  <CommandCard command={comanda} />
                  <button className="rounded-md" onClick={() => cambiarEstado(comanda.numeroComanda, EstadoComanda.Lista)}>
                    <HiOutlineCheck /> Todo listo
                  </button>
                </div>
              ))
            }
          </div>
        </div>
        <div className="items-center rounded-sm px-2 comanda-lista border-2">
          Listas
          <div className="flex flex-col py-1">
            {
              listos.map((comanda) => (
                <div className="flex flex-col">
                  <CommandCard command={comanda} />
                  <button className="rounded-md" onClick={() => cambiarEstado(comanda.numeroComanda, EstadoComanda.Lista)}>
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