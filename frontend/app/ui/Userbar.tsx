// app/ui/Userbar.tsx
import { HiOutlineLogout } from "react-icons/hi";

export default function Userbar() {

    return (
        <nav className="fixed top-10 left-0 z-auto w-full px-2 border-b">{/* Agregar margen superior segun Navbar */}
            <div className="flex items-center justify-between text-gray-500">
                <div className="mx-2">
                    Hola, usuario{/* Obtener nombre o rol del usuario */}
                </div>
                <div className=" mx-6">
                    <button className="flex flex-row items-center gap-x-1 hover:text-white transition duration-200 text-xs sm:text-sm">
                        <span className="hidden sm:inline">Cerrar sesión</span>
                        <HiOutlineLogout className="text-lg sm:text-base" />
                    </button>
                </div>
            </div>
        </nav>
    );
}