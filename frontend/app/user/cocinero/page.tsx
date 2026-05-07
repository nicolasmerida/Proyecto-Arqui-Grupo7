// app/user/cocinero/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Cocinero',
};

export default function Cocinero() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <div>Resumen</div>
      <div className="flex flex-row justify-between items-center border-amber-200 border-2 w-full">
        <div className="py-2">Platos pendientes</div>
        <div className="py-2">En Preparación</div>
        <div className="py-2">Platos listos</div>
      </div>
    </div>
  );
}