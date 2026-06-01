// app/user/admin/staff/page.tsx
import TableStaff from "@/app/ui/staff/table-staff";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Staff',
};

export default function Staff() {

    return(
        <>
        <div className="flex flex-row justify-between m-2">
            <div className="flex flex-col justify-start">
                <span className="font-serif font-semibold text-xl text-black">Usuarios</span>
                <span className="text-sm text-gray-400">Personal del restuarante</span>
            </div>
            <button className="rounded-lg text-center">
                {/* Invocar función para registrar un nuveo usuario en el backend */}
                Nuevo usuario
            </button>
        </div>
        <div className="m-2">
            <TableStaff />
        </div>
        </>
    );
}