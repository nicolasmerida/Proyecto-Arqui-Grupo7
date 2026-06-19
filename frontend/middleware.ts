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
        if (role === "ADMINISTRADOR") return NextResponse.redirect(new URL("/user/admin", req.url));
        if (role === "COCINERO") return NextResponse.redirect(new URL("/user/cocinero", req.url));
        if (role === "MOZO") return NextResponse.redirect(new URL("/user/mozo", req.url));

        // Fallback por si acaso el rol es null
        return NextResponse.redirect(new URL("/user/admin", req.url));
    }

    // Restricciones de seguridad para roles inferiores (el Administrador tiene acceso libre a todo)
    if (role === "COCINERO" && !pathname.startsWith("/user/cocinero")) {
        return NextResponse.redirect(new URL("/user/cocinero", req.url));
    }

    if (role === "MOZO" && !pathname.startsWith("/user/mozo")) {
        return NextResponse.redirect(new URL("/user/mozo", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/user", "/user/:path*"],
};