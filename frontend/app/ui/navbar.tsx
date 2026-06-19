// app/ui/navbar.tsx
'use client';
import Link from "next/link"
import { useState } from "react";
import { HiOutlineLogin } from "react-icons/hi";
import { usePathname } from 'next/navigation';
import { Session } from "next-auth";

const navLinkClass =
    "relative text-amber-100 text-lg transition-transform duration-300 hover:scale-105";

const underlineClass = `
  after:content-[''] after:absolute after:-bottom-1 after:left-0
  after:w-0 after:h-[1px] after:bg-amber-100
  hover:after:w-full after:transition-all after:duration-300
`;

export default function Navbar({ session }: { session?: Session | null }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const isUserArea = pathname?.startsWith('/user') || false;

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const inicioPorRol: Record<string, string> = {
        "ADMINISTRADOR": '/user/admin',
        "COCINERO": '/user/cocinero',
        "MOZO": '/user/mozo'
    };
    const inicioHref = session?.user?.role ? inicioPorRol[session.user.role as string] ?? '/' : '/';

    const menuHref = (session?.user?.role === "MOZO") ? '/user/mozo' : '/menu';

    return (
        <nav className="fixed top-0 left-0 bg-amber-500 z-40 w-full p-4">
            <div className="grid grid-cols-3 items-center">
                <Link href="/" className="text-amber-100 text-base font-semibold tracking-wide">Gestión Restaurante</Link>

                {/* Menú de navegación principal para desktop */}
                <div className="hidden md:flex justify-center space-x-6">
                    <Link href={inicioHref} className={`${navLinkClass} ${underlineClass}`}>
                        <span>Inicio</span>
                    </Link>
                    <Link href={menuHref} className={`${navLinkClass} ${underlineClass}`}>
                        <span>Menú</span>
                    </Link>
                </div>

                {/* Icono de login - Si hay una sesión iniciada ocultar */}
                <div className="flex items-center justify-end space-x-2 md:space-x-4">
                    {!session?.user && (
                        <Link href="/login" className={`flex flex-row items-center space-x-1 ${navLinkClass} ${underlineClass}`}>
                            <span>Iniciar sesión</span>
                            <HiOutlineLogin className="text-xl" />
                        </Link>
                    )}

                    {/* Botón de hamburguesa para móvil */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden w-5 h-5 relative flex items-center justify-center bg-amber-500/50"
                        aria-label="Toggle Mobile Menu"
                    >
                        <span
                            className={`absolute h-0.5 w-4 bg-yellow-600 transition-all duration-300 ease-in-out
                                        ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'}
                                        `}
                        />
                        <span
                            className={`absolute h-0.5 w-4 bg-yellow-600 transition-all duration-300 ease-in-out
                                        ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}
                                        `}
                        />
                        <span
                            className={`absolute h-0.5 w-4 bg-yellow-600 transition-all duration-300 ease-in-out
                                        ${isMobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'}
                                        `}
                        />
                    </button>
                </div>
            </div>

            {/* Menú móvil desplegable */}
            <div
                className={`
                    md:hidden overflow-hidden transition-all duration-500 ease-in-out
                    bg-amber-400 bg-opacity-70 px-6 border-yellow-400
                    backdrop-blur-md z-50 shadow-md
                    ${isMobileMenuOpen ? 'max-h-64 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}
                `}
            >
                <div className="flex flex-col space-y-4 transition-opacity duration-300 delay-100">
                    <Link href={inicioHref} className={`${navLinkClass} ${underlineClass} self-start`} onClick={toggleMobileMenu}>
                        <span>Inicio</span>
                    </Link>
                    <Link href={menuHref} className={`${navLinkClass} ${underlineClass} self-start`} onClick={toggleMobileMenu}>
                        <span>Menú</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}