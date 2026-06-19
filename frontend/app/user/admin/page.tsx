// app/user/admin/page.tsx
export const dynamic = 'force-dynamic';
import StatsBar from "@/app/ui/admin/StatsBar";
import StockAlerts from "@/app/ui/admin/StockAlerts";
import TopSales from "@/app/ui/admin/TopSales";
import { getAlertasStock } from "@/app/lib/actions";
import ExportarGoogleSheets from "@/app/ui/admin/ExportarGoogleSheets";

export default async function Admin() {
  const initialAlerts = await getAlertasStock();

  return (
    <div className="min-h-screen bg-slate-50/50 pb-10">
      {/* Header Premium */}
      <div className="bg-white border-b border-slate-200 px-8 py-8 shadow-sm">
        <h1 className="text-3xl font-bold font-serif italic text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Resumen general y métricas del restaurante</p>
      </div>

      <main className="px-8 py-6 max-w-7xl mx-auto space-y-6">
        <StatsBar />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TopSales />
          </div>
          <div className="lg:col-span-1">
            <StockAlerts initialAlerts={initialAlerts} />
          </div>
        </div>
      </main>
<<<<<<< HEAD
=======
      <StockAlerts initialAlerts={initialAlerts} />
      <ExportarGoogleSheets />
>>>>>>> f4091dd2a37b03ec9350652e62b64a5b2dacd1e2
    </div >
  );
}