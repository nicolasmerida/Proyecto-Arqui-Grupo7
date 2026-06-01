// app/ui/Userbar.tsx
import { HiOutlineLogout } from "react-icons/hi";

export default function Userbar() {

    return (
        <nav className="fixed top-0 left-0 w-full z-auto shadow-sm m-8">    {/* Agregar margen superior segun Navbar */}
            <div className="flex items-center justify-between text-gray-500 px-6 py-3">
                <div>
                    Hola, usuario{/* Obtener nombre o rol del usuario */}
                </div>
                <div>
                    <button className="flex flex-row items-center gap-x-1 hover:text-white transition duration-200 text-xs sm:text-sm">
                        <span className="hidden sm:inline">Cerrar sesión</span>
                        <HiOutlineLogout className="text-lg sm:text-base" />
                    </button>
                </div>
            </div>
        </nav>
    );
}