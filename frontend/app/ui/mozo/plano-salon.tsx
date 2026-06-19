// app/ui/mozo/plano-salon
'use client';
import { EstadoMesa, Mesa } from "@/app/lib/definitions";
import AddDiner from "@/app/ui/forms/AddDiners";
import OpcionesMesa from "@/app/ui/forms/OpcionesMesa";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GiTable } from "react-icons/gi";
import { useStompClient } from "@/app/lib/hooks/useStompClient";

enum VISTA { "todas", "libres", "ocupadas" };

export default function PlanoSalon() {
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [vista, setVista] = useState<VISTA>(VISTA.todas);
    const [mesaSeleccionada, setMesaSeleccionada] = useState<Mesa | null>(null);
    const [comensales, setComensales] = useState<number>(1);
    const [cargando, setCargando] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalOcupadaVisible, setModalOcupadaVisible] = useState(false);
    const [comandaActivaId, setComandaActivaId] = useState<number | null>(null);
    const [comandaActivaItems, setComandaActivaItems] = useState<any[]>([]);
    const [totalComanda, setTotalComanda] = useState<string>("0.00");
    const router = useRouter();

    //Consultar mesas al backend
    const fetchMesas = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
            const response = await fetch(`${baseUrl}/api/mesas`);

            if (!response.ok) {
                let errorMessage = `Error ${response.status} inesperado al consultar mesas`;
                let errorCode = `ERROR_DESCONOCIDO`;
                try {
                    const errorData = await response.json();
                    if (errorData?.error?.message) {
                        errorMessage = errorData.error.message;
                        errorCode = errorData.error.code || errorCode;
                    }
                }
                catch (e) {
                    //Se mantiene el mensaje de error por defecto
                }
                throw new Error(errorMessage, { cause: errorCode });
            }

            const data = await response.json();
            setMesas(data);
        }
        catch (error) {
            console.error("Error al obtener las mesas:", error);
        }
    };

    const handleMesaLibre = (mesa: Mesa) => {
        setMesaSeleccionada(mesa);
        setComensales(1);
        setModalVisible(true);
    };

    const handleMesaOcupada = async (mesa: Mesa) => {
        if (cargando) return;
        setCargando(true);
        setMesaSeleccionada(mesa);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
            const responseComanda = await fetch(`${baseUrl}/api/comandas/mesa/${mesa.numeroMesa}`);
            if (!responseComanda.ok) throw new Error("No se pudo obtener la comanda de la mesa.");
            const comandaResumen = await responseComanda.json();

            const responseDetalle = await fetch(`${baseUrl}/api/comandas/${comandaResumen.numeroComanda}`);
            if (!responseDetalle.ok) throw new Error("No se pudo obtener el detalle de la comanda.");
            const comandaDetalle = await responseDetalle.json();

            const responseTotal = await fetch(`${baseUrl}/api/comandas/${comandaDetalle.numeroComanda}/total`);
            if (!responseTotal.ok) throw new Error("No se pudo obtener el total.");
            const total = await responseTotal.text();

            setComandaActivaId(comandaDetalle.numeroComanda);
            setComandaActivaItems(comandaDetalle.items || []);
            setTotalComanda(total);
            setModalOcupadaVisible(true);
        } catch (error) {
            console.error(error);
            alert("Hubo un error al cargar los datos de la mesa.");
        } finally {
            setCargando(false);
        }
    };

    const abrirMesa = async (mesa: Mesa, numeroComensales: number) => {
        if (cargando) return;
        setCargando(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
            const response = await fetch(`${baseUrl}/api/mesas/${mesa.numeroMesa}/estado`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    estadoMesa: "Ocupada",
                    numeroComensales: numeroComensales
                })
            });

            if (!response.ok) {
                let errorMessage = `Error ${response.status} inesperado al abrir la mesa`;
                let errorCode = `ERROR_DESCONOCIDO`;
                try {
                    const errorData = await response.json();
                    if (errorData?.error?.message) {
                        errorMessage = errorData.error.message;
                        errorCode = errorData.error.code || errorCode;
                    }
                }
                catch (e) {
                }
                throw new Error(errorMessage, { cause: errorCode });
            }

            await response.json();
            const responseComanda = await fetch(`${baseUrl}/api/comandas/mesa/${mesa.numeroMesa}`);

            if (!responseComanda.ok) {
                throw new Error(`No se pudo obtener la comanda de la mesa ${mesa.numeroMesa}`);
            }

            const comanda = await responseComanda.json();
            setModalVisible(false);
            router.push(`/user/mozo/menu?comanda=${comanda.numeroComanda}`);
        }
        catch (error) {
            console.error("Error al abrir la mesa:", error);
        }
        finally {
            setCargando(false);
        }
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setMesaSeleccionada(null);
    };

    const onMesaUpdate = useCallback((mesaActualizada: Mesa) => {
        setMesas(prev => prev.map(m =>
            m.numeroMesa === mesaActualizada.numeroMesa ? mesaActualizada : m
        ));
    }, []);

    useStompClient<Mesa>('/topic/mesa', onMesaUpdate);

    useEffect(() => {
        fetchMesas();
    }, []);

    const mesasOcupadas = mesas.filter(mesa => mesa.estadoMesa === EstadoMesa.Ocupada);
    const mesasLibres = mesas.filter(mesa => mesa.estadoMesa === EstadoMesa.Libre);

    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <span className="text-xl text-white font-serif italic">Plano del salon</span>
                    <span className="text-sm text-gray-300">
                        {mesasOcupadas.length} ocupadas - {mesasLibres.length} libres
                    </span>
                </div>
                <div className="flex flex-row items-center p-1 gap-1">
                    <button className={`border rounded-lg transition ${vista === VISTA.todas ? "text-black bg-amber-200" : "text-slate-400"}`}
                            onClick={() => setVista(VISTA.todas)}>
                        Todas
                    </button>
                    <button className={`border rounded-lg transition ${vista === VISTA.libres ? "text-black bg-amber-200" : "text-slate-400"}`}
                            onClick={() => setVista(VISTA.libres)}>
                        Libres
                    </button>
                    <button className={`border rounded-lg transition ${vista === VISTA.ocupadas ? "text-black bg-amber-200" : "text-slate-400"}`}
                            onClick={() => setVista(VISTA.ocupadas)}>
                        Ocupadas
                    </button>
                </div>
            </div>
            {(mesas.length > 0) ? (
                <div className="grid grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 gap-2 m-1">
                    {(vista === VISTA.todas || vista === VISTA.libres) && (
                        mesasLibres.map((mesa, index) => (
                            <button key={index} className="border rounded-lg p-2 bg-green-300 border-green-500"
                                    onClick={() => handleMesaLibre(mesa)}
                                    disabled={cargando}
                            >
                                <div className="flex flex-col justify-center items-center text-green-500">
                                    <GiTable className="text-3xl" />
                                    <span className="text-lg font-serif">Mesa {mesa.numeroMesa}</span>
                                    <span className="text-sm">{mesa.capacidad} personas</span>
                                </div>
                            </button>
                        ))
                    )}
                    {(vista === VISTA.todas || vista === VISTA.ocupadas) && (
                        mesasOcupadas.map((mesa, index) => (
                            <button key={index} className="border rounded-lg p-2 bg-red-300 border-red-500 hover:bg-red-400 transition-colors group relative overflow-hidden"
                                    onClick={() => handleMesaOcupada(mesa)}
                                    disabled={cargando}
                            >
                                <div className="flex flex-col justify-center items-center text-red-600 group-hover:text-red-800 transition-colors">
                                    <GiTable className="text-xl" />
                                    <span className="text-lg font-serif">Mesa {mesa.numeroMesa}</span>
                                    <span className="text-sm">{mesa.capacidad} personas</span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            ) : (
                <p className="col-span-full text-center italic text-slate-500">
                    No hay platos disponibles.
                </p>
            )}

            {modalVisible && mesaSeleccionada && (
                <AddDiner
                    mesa={mesaSeleccionada}
                    comensales={comensales}
                    setComensales={setComensales}
                    onClose={cerrarModal}
                    onSubmit={() => abrirMesa(mesaSeleccionada, comensales)}
                    cargando={cargando}
                />
            )}

            {modalOcupadaVisible && mesaSeleccionada && comandaActivaId !== null && (
                <OpcionesMesa
                    mesa={mesaSeleccionada}
                    comandaId={comandaActivaId}
                    total={totalComanda}
                    items={comandaActivaItems}
                    onClose={() => { setModalOcupadaVisible(false); setMesaSeleccionada(null); }}
                    onAgregarPlatos={() => router.push(`/user/mozo/menu?comanda=${comandaActivaId}`)}
                    cargando={cargando}
                />
            )}
        </div>
    );
}