// app/ui/Userbar.tsx
import { HiOutlineLogout } from "react-icons/hi";

export default function Userbar() {

    return (
        <div className="fixed top-0 right-12 md:right-4 z-50 flex items-center h-[56px] gap-4 pr-4">
            <div className="text-sm text-white font-medium">
                Hola, usuario
            </div>
            <button className="flex flex-row items-center gap-x-1 text-white hover:text-gray-300 transition duration-200 text-xs sm:text-sm">
                <span className="hidden sm:inline">Cerrar sesión</span>
                <HiOutlineLogout className="text-lg sm:text-base" />
            </button>
        </div>
    );
}