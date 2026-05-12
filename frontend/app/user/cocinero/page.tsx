// app/user/cocinero/page.tsx
import CommandCard from "@/app/ui/Cocinero/command-car";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Cocinero',
};

export default function Cocinero() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <div className="flex flex-row justify-between items-center border-amber-200 border-2 w-full">
        <div className="py-2">
          Platos pendientes
          <div className="flex flex-col">
            <CommandCard />
          </div>
        </div>
        <div className="py-2">
          En Preparación
          <div className="flex flex-col">
            <CommandCard />
          </div>
        </div>
        <div className="py-2">
          Platos listos
          <div className="flex flex-col">
            <CommandCard />
          </div>
        </div>
      </div>
    </div>
  );
}