// app/ui/staff/table-staff.tsx
'use client';
import { EstadoUsuario, Usuario } from "@/app/lib/definitions";
import { useState } from "react";

export default function TableStaff() {
    //Consultar staff al backend
    const [staff, setStaff] = useState<Usuario []>([]);

    const handleState = (userId: number) => {
        //Cambiar el estado del usuario
        //Actualizar estado en backend?
    }

    return (
        <div className="overflow-hidden rounded-xl border">
            <table className="w-full p-2">
                <thead>
                    <tr className="text-left text-sm uppercase">
                        <th>Usuario</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {staff.map((user) => {
                        const condEstado = (user.estado === EstadoUsuario.Activo) ?
                                            "text-green-600 bg-green-300" :
                                            "text-gray-600 bg-gray-300";

                        return (
                            <tr key={user.id} className="m-2">
                                <td className="text-black font-bold">
                                    {user.nombre}
                                </td>
                                <td>
                                    <span className="text-gray-400">{user.email}</span>
                                </td>
                                <td className="text-black font-semibold">
                                    {user.rol}
                                </td>
                                <td className={`rounded-xl border ${condEstado}`}>
                                    {user.estado}
                                </td>
                                <td>
                                    {(user.estado === EstadoUsuario.Activo) ? (
                                        <button className="text-black font-semibold border rounded-lg"
                                                /*onClick={handleState(user.id)}*/>
                                                    Suspender
                                        </button>
                                    ) : (
                                        <button className="text-black font-semibold border rounded-lg"
                                                /*onClick={handleState(user.id)}*/>
                                                    Activar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                        })
                    }
                    </tbody>
            </table>
        </div>
    );
}