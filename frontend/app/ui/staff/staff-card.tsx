// app/ui/staff/staff-card.tsx
import { EstadoUsuario, Rol, Usuario } from "@/app/lib/definitions";
import { HiOutlineUserGroup } from "react-icons/hi2";

interface StaffCardProps {
    staff: Usuario[]
}

export default function StaffCard({ staff }: StaffCardProps) {
    //Consultar la cantidad total y cantidad de activos
    const mozos = staff.filter((m) => m.rol === Rol.Mozo);
    const activos = mozos.filter((a) => a.estado === EstadoUsuario.Activo);

    return (
        <div className="flex flex-col border p-4 rounded-md shadow-sm bg-white min-w-[200px]">
            <div className="flex font-semibold text-base text-gray-400 justify-between items-center mb-2">
                <span>Mozos activos</span>
                <HiOutlineUserGroup className="text-xl" />
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-serif text-black">
                    {activos.length}
                </span>
                <span className="text-sm text-gray-400 font-medium">
                    / {mozos.length} total
                </span>
            </div>
        </div>
    );
}