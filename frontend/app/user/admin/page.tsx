//app/user/admin/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Admin',
};

export default function Admin() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      Hola! Soy un Admin
    </div>
  );
}