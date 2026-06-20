// app/ui/stock/AddStaff.tsx
'use client';
import { EstadoUsuario, Rol, Usuario } from "@/app/lib/definitions";
import bcrypt from "bcryptjs";
import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";

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
                    password: await bcrypt.hash(password, 8),
                    rol: rol,
                    estadoUsuario: state
                })
            });
            if (!response.ok) {
                let errorMessage = `Error ${response.status} inesperado al registrar un nuevo usuario`;
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
            onAddStaff(data);
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-bold font-serif italic text-slate-800">
                            Nuevo Usuario
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Ingresa los datos del nuevo integrante</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <HiOutlineX size={20} />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label htmlFor="name" className="text-sm font-bold text-slate-700">
                            Nombre
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Ej. Juan Pérez"
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label htmlFor="email" className="text-sm font-bold text-slate-700">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="juan@restaurante.com"
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <label htmlFor="password" className="text-sm font-bold text-slate-700">
                            Contraseña temporal
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            minLength={8}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="space-y-2 pt-2">
                        <label className="text-sm font-bold text-slate-700">
                            Rol del Usuario
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                        {ROL_OPTIONS.map(option => (
                            <label key={option} className={`flex items-center justify-center py-2.5 px-3 border rounded-xl cursor-pointer transition-all ${rol === option ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value={option}
                                    checked={rol === option}
                                    onChange={() => setRol(option)}
                                    className="hidden"
                                    required
                                />
                                <span className="text-sm capitalize">{option}</span>
                            </label>
                        ))}
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button className="px-5 py-2.5 text-sm font-bold rounded-xl text-slate-600 hover:bg-slate-200 transition-colors" onClick={onClose} disabled={loading}>
                        Cancelar
                    </button>
                    <button className={`px-6 py-2.5 text-sm font-bold rounded-xl text-white shadow-md transition-all ${loading || !name || !email || !password || !rol ? 'bg-amber-400 cursor-not-allowed opacity-70' : 'bg-linear-to-r from-amber-300 to-yellow-600 hover:from-amber-400 hover:to-yellow-600 hover:shadow-lg hover:-translate-y-0.5'}`} onClick={handleAdd} disabled={loading || !name || !email || !password || !rol}>
                        {loading ? "Creando..." : "Crear Usuario"}
                    </button>
                </div>
            </div>
        </div>
    );
}