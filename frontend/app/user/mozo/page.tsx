// app/user/mozo/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Mozo',
};

export default function Mozo() {
  
  return (
    <div className="flex flex-row flex-1 items-center justify-center p-2">
      <div className="flex-col">
        <div>Plano del salon</div>
        <div>Salon</div>
      </div>
      <div className="flex-col p-1">
        <div>Comandas</div>
        <div>Lista de comandas</div>
      </div>
    </div>
  );
}