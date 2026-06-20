// app/user/cocinero/page.tsx
import { getComandasCocina } from "@/app/lib/actions";
import CocineroDashboard from "@/app/ui/cocinero/cocinero-dashboard";

export const dynamic = 'force-dynamic';

export default async function Cocinero() {
  // Obtiene las comandas iniciales desde el servidor (SSR)
  const initialComandas = await getComandasCocina();

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <div className="w-full bg-slate-700/75 rounded-2xl m-4 p-4">
        <CocineroDashboard initialComandas={initialComandas} />
      </div>
    </div>
  );
}