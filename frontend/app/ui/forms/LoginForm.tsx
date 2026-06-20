// app/ui/forms/LoginForm.tsx
'use client';
import { authenticate } from '@/app/lib/actions';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const navLinkClass =
  "relative text-amber-200 text-sm transition-transform duration-300 hover:scale-105";

const underlineClass = `
  after:content-[''] after:absolute after:-bottom-1 after:left-0
  after:w-0 after:h-[1px] after:bg-amber-200
  hover:after:w-full after:transition-all after:duration-300
`;

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado para mostrar/ocultar contraseña
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  // Función para alternar la visibilidad de la contraseña
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        action={formAction}
        className="bg-slate-700/75 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-white"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Iniciar sesión</h1>

        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="username"
            type="text"
            name="email"
            className="w-full px-4 py-2 rounded-md bg-amber-200 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="Ingrese su usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'} // Cambia el tipo según el estado `showPassword`
              name="password"
              className="w-full px-4 py-2 rounded-md bg-amber-200 text-white placeholder-white/60
                         focus:outline-none focus:ring-2 focus:ring-amber-400 pr-10"
              placeholder="Ingrese su contraseña"
              value={password}
              minLength={8}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-amber-400 hover:text-yellow-500 focus:outline-none"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <HiOutlineEyeOff className="h-5 w-5 text-amber-400 hover:text-amber-500" /> // Icono de ojo cerrado
              ) : (
                <HiOutlineEye className="h-5 w-5 text-yellow-400 hover:text-yellow-500" /> // Icono de ojo abierto
              )}
            </button>
          </div>
        </div>

        <input type="hidden" name="redirectTo" value="/user" />

        <button
          type="submit"
          aria-disabled={isPending} // Deshabilita el botón mientras la acción está pendiente
          className="mb-4 w-full py-2 bg-orange-300 hover:bg-orange-500 text-lg text-white font-semibold rounded-md shadow-md transition"
        >
          {isPending ? 'Ingresando...' : 'Ingresar'}
        </button>

        <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
          {(errorMessage) && (
            <>
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </form>
    </div>
  );
}