// app/ui/navbar.tsx
'use client';
import Link from "next/link"
import { useState } from "react";
import { HiOutlineLogin } from "react-icons/hi";
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import { Rol } from "@/app/lib/definitions";

const navLinkClass =
  "relative text-white text-sm transition-transform duration-300 hover:scale-105";

const underlineClass = `
  after:content-[''] after:absolute after:-bottom-1 after:left-0
  after:w-0 after:h-[1px] after:bg-white
  hover:after:w-full after:transition-all after:duration-300
`;

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const isUserArea = pathname?.startsWith('/user') || false;
    const session = useSession();
    
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const inicioPorRol = {
        [Rol.Administrador]: '/user/admin',
        [Rol.Cocinero]: '/user/cocinero',
        [Rol.Mozo]: '/user/mozo'
    };
    const inicioHref = session?.data?.user.role ? inicioPorRol[session.data.user.role] ?? '/' : '/';

    const menuHref = (session?.data?.user.role === Rol.Mozo) ? '/user/mozo' : '/menu';

    return (
        <nav className="fixed top-0 left-0 bg-blue-400 z-auto w-full p-4">
            <div className="grid grid-cols-3 text-slate-700 items-center">
                <Link href="/">Gestion_Restaurante</Link>

                {/* Menú de navegación principal para desktop */}
                <div className="hidden md:flex justify-center space-x-6">
                    <Link href={inicioHref} className={`${navLinkClass} ${underlineClass}`}>Inicio</Link>
                    <Link href={menuHref} className={`${navLinkClass} ${underlineClass}`}>Menú</Link>
                </div>

                {/* Icono de login - Si hay una sesión iniciada ocultar */}
                <div className="flex items-center justify-end space-x-2 md:space-x-4">
                    {!isUserArea && (
                        <Link href="/login" className={`flex flex-row space-x-1 ${navLinkClass} ${underlineClass}`}>
                            <span>Iniciar sesión</span>
                            <HiOutlineLogin className="text-base" />
                        </Link>
                    )}

                    {/* Botón de hamburguesa para móvil */}
                    <button
                    onClick={toggleMobileMenu}
                    className="md:hidden w-5 h-5 relative flex items-center justify-center"
                    aria-label="Toggle Mobile Menu"
                    >
                    <span
                        className={`absolute h-0.5 w-4 bg-white transition-all duration-300 ease-in-out
                                    ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'}
                                    `}
                    />
                    <span
                        className={`absolute h-0.5 w-4 bg-white transition-all duration-300 ease-in-out
                                    ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}
                                    `}
                    />
                    <span
                        className={`absolute h-0.5 w-4 bg-white transition-all duration-300 ease-in-out
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
                bg-blue-400 bg-opacity-70 px-6 border-cyan-400
                backdrop-blur-md z-50 shadow-md
                ${isMobileMenuOpen ? 'max-h-64 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}
            `}
            >
                <div className="flex flex-col space-y-4 transition-opacity duration-300 delay-100">
                    <Link href="/" className={`${navLinkClass} ${underlineClass}`} onClick={toggleMobileMenu}>
                        Inicio
                    </Link>
                    <Link href={menuHref} className={`${navLinkClass} ${underlineClass}`} onClick={toggleMobileMenu}>
                        Menu
                    </Link>
                </div>
            </div>
        </nav>
    );
}