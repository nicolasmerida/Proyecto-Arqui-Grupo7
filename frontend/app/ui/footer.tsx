// app/ui/footer.tsx
import Image from "next/image";
import Link from "next/link";
import { DiGithubBadge } from "react-icons/di";

export default function Footer() {

  return (
    <footer className="bg-blue-800 text-white p-2 w-full mt-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center">
            <div className="flex flex-col m-1 sm:m-0 items-center">
                <p><strong>Arquitectura y Diseño de Sistemas</strong></p>
                <p>DCIC - Universidad Nacional del Sur</p>
                <p>Bahía Blanca</p>
            </div>
            <div className="flex items-center justify-center">
                <Image
                    className="h-auto m-2 p-2"
                    src="/logoDCIC.png"
                    alt="Logo DCIC"
                    width={150}
                    height={66}
                />
            </div>
            <div className="grid grid-cols-2 gap-2 justify-self-center">
                <div className="flex flex-col justify-start m-1 sm:m-0">
                    <div className="flex justify-start text-white hover:underline gap-1 hover:opacity-80 transition-opacity"> 
                        <DiGithubBadge />
                        <Link
                        href="https://github.com/Faust0g" 
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        Fausto Gonzalo
                        </Link>
                    </div>
                    <div className="flex justify-start text-white hover:underline gap-1 hover:opacity-80 transition-opacity"> 
                        <DiGithubBadge />
                        <Link
                        href="https://github.com/5q8" 
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        Esteban Lartigau
                        </Link>
                    </div>
                    <div className="flex justify-start text-white hover:underline gap-1 hover:opacity-80 transition-opacity"> 
                        <DiGithubBadge />
                        <Link
                        href="https://github.com/nicolasmerida" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:underline"
                        >
                        Nicolas Mérida
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col justify-start m-1">
                    <div className="flex justify-start text-white hover:underline gap-1 hover:opacity-80 transition-opacity"> 
                        <DiGithubBadge />
                        <Link
                        href="https://github.com/zalongope" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:underline"
                        >
                        Gonzalo Perez
                        </Link>
                    </div>
                    <div className="flex justify-start text-white hover:underline gap-1 hover:opacity-80 transition-opacity"> 
                        <DiGithubBadge />
                        <Link
                        href="https://github.com/ellukirap" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:underline"
                        >
                        Lucas Solmoni
                        </Link>
                    </div>
                    <div className="flex justify-start text-white hover:underline gap-1 hover:opacity-80 transition-opacity"> 
                        <DiGithubBadge />
                        <Link
                        href="https://github.com/5imontl" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:underline"
                        >
                        Simón Torres Luna
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  );
}