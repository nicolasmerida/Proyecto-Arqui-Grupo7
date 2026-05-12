// app/ui/footer.tsx
import Link from "next/link";
import { DiGithubBadge } from "react-icons/di";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-2 w-full mt-auto">
      <div className="flex flex-col sm:flex-row items-center sm:justify-between">
        <div className="flex flex-col mb-2 sm:mb-0 items-center">
            <p><strong>Arquitectura y Diseño de Sistemas</strong></p>
            <p>DCIC - Universidad Nacional del Sur</p>
            <p>Bahía Blanca</p>
        </div>
        <div className="flex flex-row justify-between">
            <div className="flex flex-col items-center m-1 mr-2">
                <p className="flex items-center gap-1 hover:opacity-80 transition-opacity"> 
                    <Link
                    href="https://github.com/Faust0g" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline"
                    >
                    <DiGithubBadge />
                    Fausto Gonzalo
                    </Link>
                </p>
                <p className="flex items-center gap-1 hover:opacity-80 transition-opacity"> 
                    <Link
                    href="https://github.com/5q8" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline"
                    >
                    <DiGithubBadge />
                    Esteban Lartigau
                    </Link>
                </p>
                <p className="flex items-center gap-1 hover:opacity-80 transition-opacity"> 
                    <Link
                    href="https://github.com/nicolasmerida" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline"
                    >
                    <DiGithubBadge />
                    Nicolas Mérida
                    </Link>
                </p>
            </div>
            <div className="flex flex-col items-center m-1 ml-2">
                <p className="flex items-center gap-1 hover:opacity-80 transition-opacity"> 
                    <Link
                    href="https://github.com/zalongope" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline"
                    >
                    <DiGithubBadge />
                    Gonzalo Perez
                    </Link>
                </p>
                <p className="flex items-center gap-1 hover:opacity-80 transition-opacity"> 
                    <Link
                    href="https://github.com/ellukirap" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline"
                    >
                    <DiGithubBadge />
                    Lucas Solmoni
                    </Link>
                </p>
                <p className="flex items-center gap-1 hover:opacity-80 transition-opacity"> 
                    <Link
                    href="https://github.com/5imontl" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline"
                    >
                    <DiGithubBadge />
                    Simón Torres Luna
                    </Link>
                </p>
            </div>
        </div>
      </div>
    </footer>
  );
}