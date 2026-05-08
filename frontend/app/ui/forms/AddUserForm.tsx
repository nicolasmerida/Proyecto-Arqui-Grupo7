// app/ui/forms/AddUserForm.tsx
'use client';

import { Rol } from "@/app/lib/definitions";
import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";

const ROL_OPTIONS = Object.values(Rol) as Rol[];

export function AddUserForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState<'' | Rol>('');

    //const initialState: StateUser = { message: null, errors: {} };
    //const [state, formAction] = useActionState(addUser, initialState); Agregar funcion a invocar

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/login';
    
    return (
    <div className="min-h-screen flex items-center justify-center px-4 mt-24 mb-16">
      <form
        action={formAction}
        className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] text-white transition-all duration-300"
      >
        <h1 className="text-3xl font-semibold  font-sans text-center mb-8 tracking-tight">Registrar usuario</h1>

        {/* Nombre */}
        <div className="mb-6">
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-white/70">
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Nombre de usuario"
            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Ingrese su email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Contraseña */}
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-white/70">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={8}
            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Rol */}
        <div className="mb-4">
          <label className="text-sm font-medium text-white/70 mb-1 block">Rol</label>
            <div className="flex gap-6 mb-6">
              {ROL_OPTIONS.map(option => (
                <label key={option} className="flex items-center gap-2 text-white/80 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={option}
                    checked={rol === option}
                    onChange={() => setRol(option)}
                    className="h-4 w-4 bg-white/10 border-white/30 focus:ring-white/60 transition"
                    required
                  />
                  <span className="text-sm capitalize">{option}</span>
                </label>
              ))}
            </div>
        </div>
        
        {/* Redirección */}
        <input type="hidden" name="redirectTo" value={callbackUrl} />

        {/* Botón */}
        <button
          type="submit"
          className="w-full py-2 mt-4 bg-white/10 hover:bg-dcic_blue/50 text-white font-medium rounded-xl transition duration-300 backdrop-blur-md shadow-sm"
        >
          Registrar
        </button>

        <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
          {(state?.errors) ? (
            <>
              <p className="text-sm text-red-500">{state.message}</p>
            </>
          ) : (
            <>
              <p className="text-sm text-green-500">{state.message}</p>
            </>
          )}
        </div>
      </form>
    </div>
  );
}