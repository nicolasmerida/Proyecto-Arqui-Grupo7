// app/ui/navbar.tsx
import Link from "next/link"

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full p-4">
            <div className="flex flex-row justify-between items-center">
                <Link href="/">Nombre del sitio</Link>
                <div>Opciones</div>
                <div>Acceso</div>
            </div>
        </nav>
    );
}