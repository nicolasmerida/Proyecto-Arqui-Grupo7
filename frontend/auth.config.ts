// app/auth.config.ts
import type { NextAuthConfig } from 'next-auth';
import { Rol } from '@/app/lib/definitions';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET,
  session: {
      strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as Rol;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Rol;
      }
      return session;
    },
    authorized({ auth }) {
      return !!auth?.user;
    },
    async redirect({ baseUrl, url }) {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    }
  },
  providers: [], // esto se completa en auth.ts
} satisfies NextAuthConfig;