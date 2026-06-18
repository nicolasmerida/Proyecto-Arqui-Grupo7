import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";
import { Rol } from "@/app/lib/definitions";

const { auth } = NextAuth(authConfig);

export default auth((req) => {

    const session = req.auth;

    // Usuario no autenticado
    if (!session?.user) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = session.user.role;
    const pathname = req.nextUrl.pathname;

    // Usuario administrador
    if (role === Rol.Administrador && !pathname.startsWith("/user/admin")) {
        return NextResponse.redirect(new URL("/user/admin", req.url));
    }

    // Usuario cocinero
    if (role === Rol.Cocinero && !pathname.startsWith("/user/cocinero")) {
        return NextResponse.redirect(new URL("/user/cocinero", req.url));
    }

    // Usuario mozo
    if (role === Rol.Mozo && !pathname.startsWith("/user/mozo")) {
        return NextResponse.redirect( new URL("/user/mozo", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/user/:path*"],
};