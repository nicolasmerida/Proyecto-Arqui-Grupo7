// app/user/page.tsx
import { AddUserForm } from "@/app/ui/forms/AddUserForm";
import { Suspense } from "react";

export default function User() {
  
  return (
    <div className="flex flex-col flex-1 items-center justify-center my-5">  {/* Agregar margen superior segun Userbar */}
      <Suspense fallback={<div>Cargando...</div>}>
        <AddUserForm />
      </Suspense>
    </div>
  );
}