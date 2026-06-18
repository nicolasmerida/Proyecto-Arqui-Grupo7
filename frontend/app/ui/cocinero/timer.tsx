'use client';
import { useEffect, useState } from "react";

interface TimerProps {
    inicio: string; // Se espera formato ISO válido (ej: "2026-06-18T12:00:00Z")
    isListo?: boolean;
}

export default function Timer({ inicio, isListo }: TimerProps) {
    const [tiempo, setTiempo] = useState<string>("00:00");

    useEffect(() => {
        if (!inicio) return;

        // Parseamos la fecha UNA sola vez al montar o cambiar 'inicio', no dentro del intervalo
        const fechaInicio = new Date(inicio).getTime();

        // Validamos que la fecha sea correcta para evitar que devuelva "NaN"
        if (isNaN(fechaInicio)) {
            setTiempo("--:--");
            return;
        }

        const calcularDiferencia = () => {
            const diffMs = Date.now() - fechaInicio;

            if (diffMs < 0) {
                setTiempo("00:00");
                return;
            }

            const totalSegundos = Math.floor(diffMs / 1000);
            const horas = Math.floor(totalSegundos / 3600);
            const minutos = Math.floor((totalSegundos % 3600) / 60);
            const segundos = totalSegundos % 60;

            const mStr = minutos.toString().padStart(2, '0');
            const sStr = segundos.toString().padStart(2, '0');

            if (horas > 0) {
                const hStr = horas.toString().padStart(2, '0');
                setTiempo(`${hStr}:${mStr}:${sStr}`);
            } else {
                setTiempo(`${mStr}:${sStr}`);
            }
        };

        calcularDiferencia();
        const intervalId = setInterval(calcularDiferencia, 1000);

        return () => clearInterval(intervalId);
    }, [inicio]);

    if (isListo) return null;

    return (
        /* 
          Cambiamos font-mono por la tipografía de tu app.
          Usamos un color rojo/alerta desaturado (como el de la imagen) para indicar tiempo corriendo.
        */
        <span className="text-sm font-semibold text-[--color-danger-text] flex items-center gap-1">
            <svg className="w-3.5 h-3.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {tiempo}
        </span>
    );
}