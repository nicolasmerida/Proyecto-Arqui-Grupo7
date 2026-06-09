'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { authenticate } from '@/app/lib/actions';

const navLinkClass =
  "relative text-white text-sm transition-transform duration-300 hover:scale-105";

const underlineClass = `
  after:content-[''] after:absolute after:-bottom-1 after:left-0
  after:w-0 after:h-[1px] after:bg-white
  hover:after:w-full after:transition-all after:duration-300
`;

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(authenticate, {});
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        action={formAction}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-white"
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
            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Ingrese su email"
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
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white pr-10"
              placeholder="Ingrese su contraseña"
              minLength={8}
              required
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white focus:outline-none"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <HiOutlineEyeOff className="h-5 w-5" />
              ) : (
                <HiOutlineEye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          aria-disabled={isPending}
          className="mb-4 w-full py-2 bg-green-700/80 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition disabled:opacity-50"
        >
          {isPending ? 'Ingresando...' : 'Ingresar'}
        </button>

        <Link href="/user" className={`${navLinkClass} ${underlineClass}`}>
          Crear una cuenta
        </Link>

        <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
          {state?.error && (
            <p className="text-sm text-red-400">{state.error}</p>
          )}
        </div>
      </form>
    </div>
  );
}
