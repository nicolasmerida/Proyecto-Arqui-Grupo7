// app/ui/mozo/mozo-dashboard.tsx
'use client';

import { useState, useCallback } from "react";
import { ComandaResumen, EstadoComanda, Item_Pedido } from "@/app/lib/definitions";
import CommandDetailCard from "@/app/ui/mozo/command-mozo";
import PlanoSalon from "@/app/ui/mozo/plano-salon";
import { useStompClient } from "@/app/lib/hooks/useStompClient";
import { HiX, HiOutlineCash } from "react-icons/hi";

const colorByState: Record<EstadoComanda, string> = {
  [EstadoComanda.Abierta]: "comanda-abierta",
  [EstadoComanda.Cancelada]: "comanda-cancelada",
  [EstadoComanda.Cerrada]: "comanda-cerrada",
  [EstadoComanda.Entregada]: "comanda-entregada",
  [EstadoComanda.Lista]: "comanda-lista",
  [EstadoComanda.Preparacion]: "comanda-preparacion",
};

interface MozoDashboardProps {
  initialComandas: ComandaResumen[];
}

// ── NUEVO: tipo del aviso flotante ──────────────────────────────
interface AvisoComandaLista {
  numeroComanda: number;
  numeroMesa: number;
}

export default function MozoDashboard({ initialComandas }: MozoDashboardProps) {
  const [comandas, setComandas] = useState<ComandaResumen[]>(initialComandas);
  const [comandaSeleccionada, setComandaSeleccionada] = useState<ComandaResumen | null>(null);
  const [items, setItems] = useState<Item_Pedido[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [cerrando, setCerrando] = useState(false);

  // ── NUEVO: lista de avisos flotantes activos ──────────────────
  const [avisos, setAvisos] = useState<AvisoComandaLista[]>([]);

  const onComandaUpdate = useCallback((updatedComanda: ComandaResumen) => {
    setComandas((prevComandas) => {
      const anterior = prevComandas.find(
        (c) => c.numeroComanda === updatedComanda.numeroComanda
      );

      // ── NUEVO: detectar la transición a LISTA y disparar el aviso ──
      // Se compara el estado previo en pantalla contra el que llega ahora,
      // así el toast aparece solo en el momento exacto del cambio,
      // no cada vez que se recibe cualquier mensaje de esa comanda.
      const pasoALista =
        updatedComanda.estadoComanda === EstadoComanda.Lista &&
        anterior?.estadoComanda !== EstadoComanda.Lista;

      if (pasoALista) {
        setAvisos((prevAvisos) => {
          if (prevAvisos.some((a) => a.numeroComanda === updatedComanda.numeroComanda)) {
            return prevAvisos;
          }
          return [
            ...prevAvisos,
            {
              numeroComanda: updatedComanda.numeroComanda,
              numeroMesa: updatedComanda.mesa.numeroMesa,
            },
          ];
        });
      }

      // Si la comanda se cerró o canceló, la sacamos de la lista
      if ([EstadoComanda.Cerrada, EstadoComanda.Cancelada].includes(updatedComanda.estadoComanda)) {
        return prevComandas.filter(c => c.numeroComanda !== updatedComanda.numeroComanda);
      }

      if (anterior) {
        return prevComandas.map((c) =>
          c.numeroComanda === updatedComanda.numeroComanda ? updatedComanda : c
        );
      } else {
        return [...prevComandas, updatedComanda];
      }
    });
  }, []);

  const { connected } = useStompClient<ComandaResumen>('/topic/comanda', onComandaUpdate);

  // ── NUEVO: cerrar un aviso puntual ──────────────────────────────
  function descartarAviso(numeroComanda: number) {
    setAvisos((prev) => prev.filter((a) => a.numeroComanda !== numeroComanda));
  }

  const abrirModal = (comanda: ComandaResumen, items: Item_Pedido[], total: number) => {
      setComandaSeleccionada(comanda);
      setItems(items);
      setTotal(total);
      
  };

  const cerrarModal = () => {
    setComandaSeleccionada(null);
    setItems([]);
    setTotal(0);
  };

const handleCerrarComanda = async () => {
    if (!comandaSeleccionada) return;
    setCerrando(true);
    try {
        await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mesas/${comandaSeleccionada.mesa.numeroMesa}/estado`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estadoMesa: 'Libre' })
            }
        );
        setComandas(prev => prev.filter(c => c.numeroComanda !== comandaSeleccionada.numeroComanda));
        cerrarModal();
    } catch (error) {
        console.error("Error al cerrar comanda:", error);
    } finally {
        setCerrando(false);
    }
};

  return (
    <div className="flex flex-row flex-1 items-start p-4 gap-6">
      {!connected && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs shadow-lg animate-pulse">
          Desconectado del servidor...
        </div>
      )}

      {/* ── NUEVO: avisos flotantes de comandas listas ── */}
      {avisos.length > 0 && (
        <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
          {avisos.map((aviso) => (
            <div
              key={aviso.numeroComanda}
              className="bg-amber-100 border border-amber-400 text-amber-900 rounded-lg shadow-md px-4 py-3 flex items-center gap-3"
            >
              <span className="font-medium">
                🔔 Mesa {aviso.numeroMesa} — pedido listo para retirar
              </span>
              <button
                onClick={() => descartarAviso(aviso.numeroComanda)}
                className="text-amber-700 hover:text-amber-900 text-sm font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <PlanoSalon />

      <div className="flex-col p-1 w-full max-w-md">
        <div className="flex flex-row justify-between content-center bg-gray-100 p-3 rounded-t-lg border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Comandas Activas</h2>
          <div className="flex items-center justify-center bg-blue-600 text-white text-sm font-bold rounded-full w-8 h-8 shadow-sm">
            {comandas.length}
          </div>
        </div>

        <div className="flex flex-col py-2 gap-3 max-h-[80vh] overflow-y-auto pr-2">
          {comandas.length === 0 ? (
            <p className="text-gray-500 italic text-center mt-4">No hay comandas activas.</p>
          ) : (
            comandas.map((comanda) => (
              <div
                key={comanda.numeroComanda}
                className={`flex flex-col border-l-4 rounded-r-md shadow-sm bg-white overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] ${colorByState[comanda.estadoComanda]}`}
              >
              <CommandDetailCard
                  command={comanda}
                  onSelect={(items, total) => abrirModal(comanda, items, total)}
              />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {comandaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                Mesa N°{comandaSeleccionada.mesa?.numeroMesa} — Comanda #{comandaSeleccionada.numeroComanda}
              </h2>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">
                <HiX size={20} />
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-center text-gray-400 italic">Sin items.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-2">Plato</th>
                      <th className="pb-2 text-center">Cant.</th>
                      <th className="pb-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-2">{item.nombrePlato}</td>
                        <td className="py-2 text-center">{item.cantidad}</td>
                        <td className="py-2 text-right">
                          ${item.precio ? (item.precio * item.cantidad).toFixed(2) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-700">Total</span>
                <span className="text-xl font-bold text-green-600">${total.toFixed(2)}</span>
              </div>

              {comandaSeleccionada.estadoComanda === EstadoComanda.Lista && (
                <button
                  onClick={async () => {
                    setCerrando(true);
                    try {
                      const response = await fetch(
                        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comandas/${comandaSeleccionada.numeroComanda}/estado`,
                        { 
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ nuevoEstado: 'ENTREGADA' })
                        }
                      );
                      if (!response.ok) throw new Error("Error del servidor");
                      setComandas(prev => prev.map(c =>
                        c.numeroComanda === comandaSeleccionada.numeroComanda
                          ? { ...c, estadoComanda: EstadoComanda.Entregada }
                          : c
                      ));
                      setComandaSeleccionada({ ...comandaSeleccionada, estadoComanda: EstadoComanda.Entregada });
                    } catch (error) {
                      console.error("Error al entregar comanda:", error);
                    } finally {
                      setCerrando(false);
                    }
                  }}
                  disabled={cerrando}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  {cerrando ? "Entregando..." : "Marcar como entregada"}
                </button>
              )}

              {comandaSeleccionada.estadoComanda === EstadoComanda.Entregada && (
                <button
                  onClick={handleCerrarComanda}
                  disabled={cerrando}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <HiOutlineCash size={18} />
                  {cerrando ? "Cerrando..." : "Confirmar y cerrar comanda"}
                </button>
              )}

              {comandaSeleccionada.estadoComanda !== EstadoComanda.Lista &&
              comandaSeleccionada.estadoComanda !== EstadoComanda.Entregada && (
                <p className="text-xs text-center text-gray-400 italic mt-2">
                  La comanda aún no está lista para entregar.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}