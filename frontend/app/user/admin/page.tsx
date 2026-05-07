// app/user/admin/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Admin',
};

export default function Admin() {
  return (
    <div className="flex flex-row flex-1 items-center justify-center">
      Panel de opciones
      <div className="flex flex-col">
        <div>Resumen historial</div>
        <div className="flex flex-row">
          <div>Ventas semanales</div>
          <div>Platos más vendidos</div>
        </div>
        <div>Alertas de stock</div>
      </div>
    </div>
  );
}