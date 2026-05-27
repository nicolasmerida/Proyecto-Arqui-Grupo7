// app/ui/navbar.tsx
import Link from "next/link"
import { HiOutlineLogin } from "react-icons/hi";

export default function Navbar() {

    return (
        <nav className="fixed top-0 left-0 w-full p-4">
            <div className="flex flex-row justify-between items-center">
                <Link href="/">Gestion_Restaurante</Link>
                <div className="hidden md:flex ml-6 space-x-6 justify-center">
                    <Link href="/">Inicio</Link>
                    <Link href="/menu">Menú</Link> {/* Detectar rol para redirigir al menu del mozo */}
                </div>
                <Link href="/login" className="flex flex-row">
                    Iniciar sesión <HiOutlineLogin />
                </Link>
            </div>
        </nav>
    );
}