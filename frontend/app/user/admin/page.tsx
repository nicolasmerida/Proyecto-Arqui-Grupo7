// app/user/admin/page.tsx
import FunctionsPanel from "@/app/ui/admin/FunctionsPanel";
import StatsBar from "@/app/ui/admin/StatsBar";
import { HiOutlineInformationCircle } from "react-icons/hi";

export default function Admin() {
  //Consultar ventas, mas vendidos, datos de comandas, tickets y mozos para las estadisticas y alertas de stock
  return (
    <div className="flex flex-row items-center">  {/* Agregar margen superior segun Userbar */}
      <FunctionsPanel />
      <div className="flex flex-col gap-2 w-full">
        <h1 className="text-xl m-1">Bienvenido Admin</h1>
        <StatsBar />
        <div className="flex flex-row m-1 justify-between">
          <div className="flex flex-col">
            Gráfico de ventas
          </div>
          <div className="flex flex-col">
            Más vendidos
          </div>
        </div>
        <div className="flex flex-col rounded-md mx-5 text-black bg-red-300 border-red-600">
          <div className="flex items-center gap-1 text-red-600">
            <HiOutlineInformationCircle />Alertas de stock
          </div>
          Alertas por ingrediente
        </div>
      </div>
    </div>
  );
}