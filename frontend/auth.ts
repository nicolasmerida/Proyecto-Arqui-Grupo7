import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { authConfig } from '@/auth.config';
import { getUser } from '@/app/lib/actions';
 
export const { auth, signIn, signOut, handlers: {GET, POST} } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials) {
                const parsedCredentials = z
                .object({ email: z.string().email(), password: z.string().min(8) })
                .safeParse(credentials);
                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);

                    if (!user) return null;

                    //const passwordsMatch = await bcrypt.compare(password, user.password); //TODO: remove and test
                    const passwordsMatch = password === user.password;
                    if (passwordsMatch)
                        return { id: String(user.idUsuario), name: user.nombre, email: user.email, role: user.rol };
                }
                return null;
            },
        }),
    ],
});