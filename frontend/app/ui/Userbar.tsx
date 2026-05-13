// app/ui/Userbar.tsx
import { HiOutlineLogout } from "react-icons/hi";

export default function Userbar() {

    return (
        <nav className="fixed w-full z-auto shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mx-auto px-6 py-3">
                <div>
                    Hola, usuario{/* Obtener nombre o rol del usuario */}
                </div>
                <div>
                    <button className="flex flex-row items-center gap-1 hover:text-white transition duration-200 text-xs sm:text-sm">
                        <HiOutlineLogout className="text-lg sm:text-base" />
                        <span className="hidden sm:inline">Cerrar sesión</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}