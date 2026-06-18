"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PagoExitoso() {
    const searchParams = useSearchParams();
    const idMesa = searchParams.get("mesa");
    const [estadoCierre, setEstadoCierre] = useState("Cerrando la mesa...");

    useEffect(() => {
        if (idMesa) {
            // Llamamos a tu MesaService.cerrarMesa(id) en el backend
            fetch(`http://localhost:8080/api/mesas/${idMesa}/cerrar`, {
                method: "PUT", // o POST, según cómo esté definido tu controller
            })
                .then(res => {
                    if (res.ok) {
                        setEstadoCierre(`¡La Mesa #${idMesa} fue cerrada y liberada con éxito!`);
                    } else {
                        setEstadoCierre("El pago se acreditó, pero hubo un error al liberar la mesa en el sistema.");
                    }
                })
                .catch(err => {
                    console.error(err);
                    setEstadoCierre("Error de conexión al intentar liberar la mesa.");
                });
        }
    }, [idMesa]);

    return (
        <main style={{ textAlign: "center", padding: "60px" }}>
            <h1 style={{ color: "green", fontSize: "2rem" }}>✅ ¡Pago exitoso!</h1>
            <p>Tu pago fue procesado correctamente. ¡Gracias!</p>

            {/* Mensaje de confirmación del cierre de mesa */}
            <div style={{ margin: "20px 0", padding: "15px", backgroundColor: "#f0fdf4", borderRadius: "8px" }}>
                <p style={{ fontWeight: "bold", color: "#166534" }}>{estadoCierre}</p>
            </div>

            <a href="/" style={{ color: "#009ee3", textDecoration: "underline" }}>Volver al inicio</a>
        </main>
    );
}