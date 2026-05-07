// app/menu/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Menú',
};

export default function Menu() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      Bienvenido al menú de nuestro restaurante 🍽️
    </div>
  );
}