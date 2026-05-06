// app/user/mozo/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Mozo',
};

export default function Mozo() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      Hola! Soy un Mozo 🍽️
    </div>
  );
}