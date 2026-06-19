// app/ui/admin/ExportarGoogleSheets.tsx
"use client";

import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import { exportarTodo } from "@/app/lib/googleSheets";
import { HiCheckCircle, HiOutlineExternalLink } from "react-icons/hi";
import { useGoogleExport } from "./GoogleExportProvider";

function InnerExportarGoogleSheets() {
  const [cargando, setCargando] = useState(false);
  const { link, setLink } = useGoogleExport();
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
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all text-center flex items-center justify-center gap-2"
        >
          <HiCheckCircle className="text-xl" /> Abrir Google Sheets <HiOutlineExternalLink className="text-lg opacity-80" />
        </a>
      ) : (
        <button
          onClick={() => login()}
          disabled={cargando}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all"
        >
          {cargando ? "Exportando..." : "Exportar a Google Drive"}
        </button>
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