// app/ui/Userbar.tsx
import { HiOutlineLogout } from "react-icons/hi";
import { auth, signOut } from "@/auth";

export default async function Userbar() {
    const session = await auth();

    if (!session?.user) return null;

    return (
        <div className="fixed top-0 right-12 md:right-4 z-50 flex items-center h-[60px] gap-4 pr-4">
            <div className="text-sm text-amber-100 font-medium">
                Hola, <span className="font-bold">{session?.user?.name}!</span>
            </div>
            <form
                action={async () => {
                    'use server';
                    await signOut({ redirectTo: '/' });
                }}
            >
                <button className="flex flex-row items-center gap-x-1 text-white hover:text-amber-200 transition duration-200 text-xs sm:text-sm font-semibold bg-amber-600/50 hover:bg-amber-700/50 px-3 py-1.5 rounded-full border border-amber-500">
                    <span className="hidden sm:inline">Cerrar sesión</span>
                    <HiOutlineLogout className="text-lg sm:text-base" />
                </button>
            </form>
        </div>
    );
}