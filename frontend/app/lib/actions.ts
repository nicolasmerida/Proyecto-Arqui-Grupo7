'use server';

import { redirect } from 'next/navigation';
import { Usuario } from './definitions';

export type LoginState = {
  error?: string;
};

export async function authenticate(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  let usuario: Usuario;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }
    );

    if (response.status === 401) {
      return { error: 'Email o contraseña incorrectos.' };
    }

    if (!response.ok) {
      return { error: 'Error inesperado del servidor. Intentá de nuevo.' };
    }

    usuario = await response.json();
  } catch {
    return { error: 'No se pudo conectar con el servidor. Verificá que el backend esté corriendo.' };
  }

  // Redirige según el rol del usuario
  const rolRoutes: Record<string, string> = {
    ADMINISTRADOR: '/user/admin',
    MOZO: '/user/mozo',
    COCINERO: '/user/cocinero',
  };
  const destino = rolRoutes[usuario.rol] ?? '/';
  redirect(destino);
}

export type RegisterState = {
  error?: string;
  success?: string;
};

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const nombre = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const rol = formData.get('role') as string;

  if (!rol) {
    return { error: 'Seleccioná un rol.' };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/usuarios`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password, rol }),
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      // Nuestro GlobalExceptionHandler devuelve { error: { message, details } }
      // El handler default de Spring devuelve { error: "string", message: "string" }
      const msg =
        data?.error?.message ||
        data?.error?.details ||
        (typeof data?.error === 'string' ? data.error : null) ||
        data?.message ||
        `Error ${response.status}`;
      return { error: msg };
    }
  } catch {
    return { error: 'No se pudo conectar con el servidor. Verificá que el backend esté corriendo.' };
  }

  redirect('/login');
}
