// app/ui/admin/ExportarGoogleSheets.tsx
"use client";

import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import { exportarTodo } from "@/app/lib/googleSheets";

function InnerExportarGoogleSheets() {
  const [cargando, setCargando] = useState(false);
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
    onSuccess: async (tokenResponse: { access_token: string }) => {
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
        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all"
      >
        {cargando ? "Exportando..." : "Exportar a Google Sheets"}
      </button>

      {link !== "" && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-medium underline text-sm transition-colors"
        >
          ✅ Exportación lista — Abrir en Google Sheets
        </a>
      )}

      {error !== "" && <p className="text-red-600 text-sm font-medium">{error}</p>}
    </div>
  );
}

export default function ExportarGoogleSheets() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <InnerExportarGoogleSheets />
    </GoogleOAuthProvider>
  );
}