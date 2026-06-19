// app/ui/staff/table-staff.tsx
'use client';
import { EstadoUsuario, Usuario } from "@/app/lib/definitions";
import AddStaff from "@/app/ui/staff/AddStaff";
import { useEffect, useState } from "react";
import { HiOutlinePlusSm, HiOutlineUserCircle, HiOutlineUserGroup } from "react-icons/hi";

export default function TableStaff() {
    const [staff, setStaff] = useState<Usuario []>([]);
    const [showAdd, setShowAdd] = useState<boolean>(false);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios`)
                if (!response.ok) {
                    let errorMessage = `Error ${response.status} inesperado al consultar el personal del restaurante`;
                    let errorCode = `ERROR_DESCONOCIDO`;
                    try {
                        const errorData = await response.json();
                        if (errorData?.error?.message) {
                            errorMessage = errorData.error.message;
                            errorCode = errorData.error.code || errorCode;
                        }
                    } catch (e) {}
                    throw new Error(errorMessage, { cause: errorCode });
                }

                const data = await response.json();
                setStaff(data);
            }
            catch (error) {
                console.error("Error al obtener el personal del restaurante:", error);
            }
        };

        fetchStaff();
    }, [])

    const handleChangeState = async (user: Usuario) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios/${user.idUsuario}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ estado: (user.estado === EstadoUsuario.Activo) ? EstadoUsuario.Suspendido : EstadoUsuario.Activo, }),
            });
            // Update local state to reflect the change immediately
            setStaff((prev) => prev.map(u => 
                u.idUsuario === user.idUsuario 
                    ? { ...u, estado: u.estado === EstadoUsuario.Activo ? EstadoUsuario.Suspendido : EstadoUsuario.Activo } 
                    : u
            ));
        } catch (error) {
            console.error("Error al cambiar estado:", error);
        }
    }

    const handleAddStaff = (newUser: Usuario) => {
        setStaff((prevStaff) => [...prevStaff, newUser]);
        setShowAdd(false);
    };

    return (
        <div className="flex flex-col space-y-6">
            <AddStaff show={showAdd} onClose={() => setShowAdd(false)} onAddStaff={handleAddStaff} />
            <div className="flex justify-end">
                <button onClick={() => setShowAdd(true)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white transition-all hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                    <HiOutlinePlusSm size={20} /> Nuevo usuario
                </button>
            </div>
            <div className="overflow-x-auto bg-white rounded-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Estado</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {staff.length > 0 ? staff.map((user) => {
                            const estadoUsuario = user.estado ?? EstadoUsuario.Activo;
                            const isActivo = estadoUsuario === EstadoUsuario.Activo;
                            const condEstado = isActivo ?
                                                "text-emerald-700 bg-emerald-100 border-emerald-200" :
                                                "text-slate-500 bg-slate-100 border-slate-200";

                            return (
                                <tr key={user.idUsuario} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                <HiOutlineUserCircle size={24} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-800">{user.nombre}</span>
                                                <span className="text-sm text-slate-500">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-semibold text-slate-700">{user.rol}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border uppercase tracking-wider ${condEstado}`}>
                                            {estadoUsuario}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${isActivo ? 'text-rose-600 bg-rose-50 hover:bg-rose-100' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}
                                                onClick={() => handleChangeState(user)}>
                                            {isActivo ? 'Suspender' : 'Activar'}
                                        </button>
                                    </td>
                                </tr>
                            );
                            }) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <HiOutlineUserGroup size={48} className="mb-3 opacity-20" />
                                            <span className="text-slate-500 font-medium">No hay usuarios registrados</span>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}