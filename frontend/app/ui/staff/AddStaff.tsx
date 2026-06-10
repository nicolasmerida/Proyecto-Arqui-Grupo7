// app/ui/stock/AddStaff.tsx
'use client';
import { EstadoUsuario, Rol, Usuario } from "@/app/lib/definitions";
import { useState } from "react";
import { HiOutlineXCircle } from "react-icons/hi";

const ROL_OPTIONS = Object.values(Rol) as Rol[];

interface AddStaffProps {
    show: boolean;
    onClose: () => void;
    onAddStaff: (user: Usuario) => void;
};

export default function AddStaff({ show, onClose, onAddStaff } : AddStaffProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState<'' | Rol>('');
    const [state, setState] = useState<EstadoUsuario>(EstadoUsuario.Activo)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!show) return null;

    const handleAdd = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: name,
                    email: email,
                    password: password,
                    rol: rol,
                    estadoUsuario: state
                })
            });
            if (!response.ok) {
                let errorMessage = `Error ${response.status} inesperado al registrar un nuevo usuario`;
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
            onAddStaff(data);//El parametro es el usuario a agregar
            onClose();
        }
        catch (error) {
            console.error("Error al registrar nuevo usuario:", error);
            setError("Error al registrar el usuario");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 items-start justify-center transition-opacity duration-300 ease-in-out">
            <div className="w-full max-w-full mx-auto bg-opacity-95 text-black transition-all duration-300 ease-in-out transform absolute shadow-md">
                <div className="flex flex-col justify-between border rounded-xl m-2">
                    <span className="text-xl font-serif font-semibold text-black">
                        Registrar nuevo usuario
                    </span>
                    <button onClick={onClose}>
                        <HiOutlineXCircle className="text-xl" />
                    </button>
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-col m-1">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-white/70">
                            Nombre
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Nombre de usuario"
                            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col m-1">
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                            placeholder="Ingrese su email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col m-1">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-white/70">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            minLength={8}
                            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col m-1">
                        <label className="text-sm font-medium text-white/70 mb-1 block">
                            Rol
                        </label>
                        <div className="flex gap-6 mb-6">
                        {ROL_OPTIONS.map(option => (
                            <label key={option} className="flex items-center gap-2 text-white/80 cursor-pointer">
                            <input
                                type="radio"
                                name="role"
                                value={option}
                                checked={rol === option}
                                onChange={() => setRol(option)}
                                className="h-4 w-4 bg-white/10 border-white/30 focus:ring-white/60 transition"
                                required
                            />
                            <span className="text-sm capitalize">{option}</span>
                            </label>
                        ))}
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end gap-2 mt-2">
                        <button className="px-4 py-2 text-center rounded-lg text-white bg-green-500 hover:bg-green-600" onClick={handleAdd} disabled={loading}>
                            {loading ? "Guardando..." : "Crear"}
                        </button>
                        <button className="px-4 py-2 text-center rounded-lg text-white bg-gray-500 hover:bg-gray-600" onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}