// app/ui/Navbar.tsx

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full">
            <div className="flex justify-between items-center">
                Nombre
            </div>
            <div className="flex justify-between items-center">
                Opciones
            </div>
            <div className="flex justify-between items-center">
                Acceso
            </div>
        </nav>
    );
}