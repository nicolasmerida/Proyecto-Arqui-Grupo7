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

    const role = session.user.role?.toUpperCase();
    const pathname = req.nextUrl.pathname;

    // Redirección inicial post-login desde la ruta base "/user"
    if (pathname === "/user" || pathname === "/user/") {
        if (role === Rol.Administrador) return NextResponse.redirect(new URL("/user/admin", req.url));
        if (role === Rol.Cocinero) return NextResponse.redirect(new URL("/user/cocinero", req.url));
        if (role === Rol.Mozo) return NextResponse.redirect(new URL("/user/mozo", req.url));
    }

    // Restricciones de seguridad para roles inferiores (el Administrador tiene acceso libre a todo)
    if (role === Rol.Cocinero && !pathname.startsWith("/user/cocinero")) {
        return NextResponse.redirect(new URL("/user/cocinero", req.url));
    }

    if (role === Rol.Mozo && !pathname.startsWith("/user/mozo")) {
        return NextResponse.redirect( new URL("/user/mozo", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/user/:path*"],
};