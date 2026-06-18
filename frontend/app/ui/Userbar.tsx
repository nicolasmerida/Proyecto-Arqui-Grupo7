// app/ui/Userbar.tsx
import { HiOutlineLogout } from "react-icons/hi";
import { auth, signOut } from "@/auth";

export default async function Userbar() {
    const session = await auth();

    return (
        <div className="fixed top-0 right-12 md:right-4 z-50 flex items-center h-14 gap-4 pr-4">
            <div className="text-sm text-white font-medium">
                Hola, <span className="font-medium">{session?.user?.name}!</span>
            </div>
            <form
                action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
                }}
            >
                <button className="flex flex-row items-center gap-x-1 text-white hover:text-gray-300 transition duration-200 text-xs sm:text-sm">
                    <span className="hidden sm:inline">Cerrar sesión</span>
                    <HiOutlineLogout className="text-lg sm:text-base" />
                </button>
            </form>
        </div>
    );
}