// app/ui/staff/table-staff.tsx
'use client';
import { EstadoUsuario, Usuario } from "@/app/lib/definitions";
import AddStaff from "@/app/ui/staff/AddStaff";
import { useEffect, useState } from "react";
import { HiOutlinePlusSm } from "react-icons/hi";

export default function TableStaff() {
    const [staff, setStaff] = useState<Usuario []>([]);
    const [showAdd, setShowAdd] = useState<boolean>(false);

    //Consultar staff al backend
    useEffect(() => {
        const fetchStaff = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios`)
            if (!response.ok) {
                let errorMessage = `Error ${response.status} inesperado al consultar el personal del restaurante`;
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
            setStaff(data);
        }
        catch (error) {
            console.error("Error al obtener el personal del restaurante:", error);
        }
        };

        fetchStaff();
    }, [])

    const handleChangeState = async (user: Usuario) => {
        //Cambiar el estado del usuario
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios/${user.idUsuario}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ estado: (user.estado === EstadoUsuario.Activo) ? EstadoUsuario.Suspendido : EstadoUsuario.Activo, }),
        });
        //Actualizar estado en backend?
    }

    const handleAddStaff = (newUser: Usuario) => {
        setStaff((prevStaff) => [...prevStaff, newUser]);
        setShowAdd(false);
    };

    return (
        <>
        <AddStaff show={showAdd} onClose={() => setShowAdd(false)} onAddStaff={handleAddStaff} />
        <div className="flex items-center justify-end mb-2">
            <button onClick={() => setShowAdd(true)}
                    className="flex items-center gap-1 rounded-xl bg-green-500 text-white text-base"
            >
                <HiOutlinePlusSm /> Nuevo usuario
            </button>
        </div>
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
                        const estadoUsuario = user.estado ?? EstadoUsuario.Activo;
                        const condEstado = (estadoUsuario === EstadoUsuario.Activo) ?
                                            "text-green-600 bg-green-300" :
                                            "text-gray-600 bg-gray-300";

                        return (
                            <tr key={user.idUsuario} className="m-2">
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
                                    {estadoUsuario}
                                </td>
                                <td>
                                    {(estadoUsuario === EstadoUsuario.Activo) ? (
                                        <button className="text-black font-semibold border rounded-lg"
                                                onClick={() => handleChangeState(user)}>
                                                    Suspender
                                        </button>
                                    ) : (
                                        <button className="text-black font-semibold border rounded-lg"
                                                onClick={() => handleChangeState(user)}>
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
        </>
    );
}