//app/user/cocinero/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Cocinero',
};

export default function Cocinero() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      Hola! Soy un Cocinero 🧑‍🍳
    </div>
  );
}