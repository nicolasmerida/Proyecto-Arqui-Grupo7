// app/ui/admin/ExportarGoogleSheets.tsx
"use client";

import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { exportarTodo } from "@/app/lib/googleSheets";

export default function ExportarGoogleSheets() {
  const [cargando, setCargando] = useState(false);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
    onSuccess: async (tokenResponse) => {
      setCargando(true);
      setError("");
      setLink("");
      try {
        const url = await exportarTodo(tokenResponse.access_token);
        setLink(url);
      } catch (e) {
        setError("Ocurrió un error al exportar. Intentá de nuevo.");
        console.error(e);
      } finally {
        setCargando(false);
      }
    },
    onError: () => setError("No se pudo autenticar con Google."),
  });

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => login()}
        disabled={cargando}
        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        {cargando ? "Exportando..." : "Exportar a Google Sheets"}
      </button>

      {link !== "" && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-sm"
        >
          ✅ Exportación lista — Abrir en Google Sheets
        </a>
      )}

      {error !== "" && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}