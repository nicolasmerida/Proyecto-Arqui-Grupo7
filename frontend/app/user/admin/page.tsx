// app/user/admin/page.tsx
import FunctionsPanel from "@/app/ui/admin/FunctionsPanel";
import StatsBar from "@/app/ui/admin/StatsBar";
import { Metadata } from "next";
import { HiOutlineInformationCircle } from "react-icons/hi";

export const metadata: Metadata = {
  title: 'Admin',
};

export default function Admin() {
  
  return (
    <div className="flex flex-row items-center justify-between">
      <FunctionsPanel />
      <div className="flex flex-col gap-2">
        <h1 className="text-xl m-1">Bienvenido Admin</h1>
        <StatsBar />
        <div className="flex flex-row m-1">
          <div>Ventas</div>
          <div>Más vendidos</div>
        </div>
        <div className="flex flex-col rounded-md bg-red-300 border-red-500">
          <div>
            <HiOutlineInformationCircle />Alertas de stock
          </div>
          Alertas por ingrediente
        </div>
      </div>
    </div>
  );
}