// app/ui/staff/staff-card.tsx
import { EstadoUsuario, Rol, Usuario } from "@/app/lib/definitions";
import { HiOutlineUserGroup } from "react-icons/hi2";

interface StaffCardProps {
    staff: Usuario[]
}

export default function StaffCard({ staff }: StaffCardProps) {
    const mozos = staff.filter((m) => m.rol === Rol.Mozo);
    const activos = mozos.filter((a) => (a.estado ?? EstadoUsuario.Activo) === EstadoUsuario.Activo);

    return (
        <div className="flex flex-col bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex font-semibold text-sm text-slate-500 justify-between items-center mb-4">
                <span className="uppercase tracking-wider">Mozos Activos</span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <HiOutlineUserGroup size={20} />
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800 tracking-tight">
                    {activos.length}
                </span>
                <span className="text-lg text-slate-400 font-medium">/ {mozos.length}</span>
            </div>
            <div className="mt-2">
                <span className="text-xs text-slate-400 font-medium">mozos registrados en el sistema</span>
            </div>
        </div>
    );
}