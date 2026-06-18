import { DefaultSession } from "next-auth";
import { Rol } from "@/app/lib/definitions";

declare module "next-auth" {

    interface Session {
        user: {
            id: string;
            role: Rol;
        } & DefaultSession["user"];
    }

    interface User {
        role: Rol;
    }
}

declare module "next-auth/jwt" {

    interface JWT {
        id?: string;
        role?: Rol;
    }

}