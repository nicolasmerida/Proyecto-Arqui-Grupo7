// app/user/admin/page.tsx
import FunctionsPanel from "@/app/ui/admin/FunctionsPanel";
import SalesChart from "@/app/ui/admin/SalesChart";
import StatsBar from "@/app/ui/admin/StatsBar";
import StockAlerts from "@/app/ui/admin/StockAlerts";
import TopSales from "@/app/ui/admin/TopSales";

export default function Admin() {
  //Consultar ventas, mas vendidos, datos de comandas, tickets y mozos para las estadisticas y alertas de stock
  return (
    <div className="min-h-screen">  {/* Agregar margen superior segun Userbar */}
      <FunctionsPanel />
      <main className=" p-4"> {/* Ajustar margen superior e izquierdo segun panel y barra  */}
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-xl m-1">Bienvenido Admin</h1>
          <StatsBar />
          <div className="flex flex-row m-1 justify-between">
            <SalesChart />
            <TopSales />
          </div>
        </div>
      </main>
      <StockAlerts />
    </div>
  );
}