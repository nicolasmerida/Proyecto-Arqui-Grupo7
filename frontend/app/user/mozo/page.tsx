// app/user/mozo/page.tsx
'use client';
import { Comanda, EstadoComanda } from "@/app/lib/definitions";
import CommandDetailCard from "@/app/ui/mozo/command-mozo";
import PlanoSalon from "@/app/ui/mozo/plano-salon";
import { useEffect, useState } from "react";

const colorByState: Record<EstadoComanda, string> = {
  [EstadoComanda.Abierta]: "comanda-abierta",
  [EstadoComanda.Cancelada]: "comanda-cancelada",
  [EstadoComanda.Cerrada]: "comanda-cerrada",
  [EstadoComanda.Entregada]: "comanda-entregada",
  [EstadoComanda.Lista]: "comanda-lista",
  [EstadoComanda.Preparacion]: "comanda-preparacion",
}

export default function Mozo() {
  const [comandas, setComandas] = useState<Comanda[]>([]);

  // Obtiene las comandas desde el backend
  const fetchComandas = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comandas`);
      
      if (!response.ok) {
        let errorMessage = `Error ${response.status} inesperado al consultar comandas`;
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
    catch (error) {
      console.error("Error al obtener las comandas:", error);
    }
  };
  
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
              <div className={`flex flex-col border-l-4 ${colorByState[comanda.estadoComanda]}`}>
                <CommandDetailCard command={comanda} />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}