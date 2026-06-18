"use client";

import { useState } from "react";

export default function PagoButton({ idMesa }: { idMesa: number }) {
    const [cargando, setCargando] = useState(false);

    const manejarPago = async () => {
        setCargando(true);
        try {
            const res = await fetch("http://localhost:8080/pagos/crear", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Mandamos el ID de la mesa a Java
                body: JSON.stringify({ idMesa: idMesa })
            });

            const urlPago = await res.text();

            if (urlPago && urlPago.startsWith("https://")) {
                window.location.href = urlPago;
            } else {
                console.error("Respuesta del servidor:", urlPago);
                alert(urlPago); // Muestra el mensaje de error de Java (ej: Si el total es 0)
            }
        } catch (e) {
            console.error("Error de conexión:", e);
            alert("No se pudo conectar con el backend. ¿Está corriendo en el puerto 8080?");
        } finally {
            setCargando(false);
        }
    };

    return (
        <button
            onClick={manejarPago}
            disabled={cargando}
            style={{
                backgroundColor: cargando ? "#ccc" : "#009ee3",
                color: "white",
                padding: "12px 24px",
                fontSize: "16px",
                border: "none",
                borderRadius: "6px",
                cursor: cargando ? "not-allowed" : "pointer",
            }}
        >
            {cargando ? "Generando pago..." : `Cobrar Mesa #${idMesa}`}
        </button>
    );
}