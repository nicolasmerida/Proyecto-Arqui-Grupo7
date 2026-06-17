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
        <div className="flex flex-col border">
            <div className="flex font-semibold text-base text-gray-400 justify-between">
                Mozos activos <HiOutlineUserGroup />
            </div>
            <div className="flex text-xl text-black font-serif">
                {activos.length}
            </div>
            <div className="text-sm text-gray-400">
                {mozos.length} staff total
            </div>
        </div>
    );
}