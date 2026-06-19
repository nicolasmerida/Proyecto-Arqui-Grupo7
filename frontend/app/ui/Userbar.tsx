// app/ui/Userbar.tsx
import { HiOutlineLogout } from "react-icons/hi";
import { auth, signOut } from "@/auth";

export default async function Userbar() {
    const session = await auth();

    if (!session?.user) return null;

    return (
<<<<<<< HEAD
        <div className="fixed top-0 right-12 md:right-4 z-50 flex items-center h-[60px] gap-4 pr-4">
            <div className="text-sm text-white font-medium">
                Hola, <span className="font-bold text-white">{session?.user?.name}!</span>
=======
        <nav className="fixed top-10 left-0 w-full z-auto bg-amber-400 shadow-sm m-8">
                    <div className="flex items-center justify-between px-6 py-3">
                        <div className="text-sm text-amber-100 font-medium">
                            Hola, <span className="font-medium">{session?.user?.name}!</span>
                        </div>
                        <form
                            action={async () => {
                                'use server';
                                await signOut({ redirectTo: '/' });
                            }}
                        >
                            <button className="flex flex-row items-center gap-x-1 hover:text-yellow-300 transition duration-200 text-xs sm:text-sm">
                                <span className="text-amber-200 hidden sm:inline">Cerrar sesión</span>
                                <HiOutlineLogout className="text-amber-200 text-lg sm:text-base" />
                            </button>
                        </form>
>>>>>>> f4091dd2a37b03ec9350652e62b64a5b2dacd1e2
                    </div>
                    <form
                        action={async () => {
                            'use server';
                            await signOut({ redirectTo: '/' });
                        }}
                    >
                        <button className="flex flex-row items-center gap-x-1 text-white hover:text-blue-200 transition duration-200 text-xs sm:text-sm font-semibold bg-blue-500/50 hover:bg-blue-600/50 px-3 py-1.5 rounded-full border border-blue-400">
                            <span className="hidden sm:inline">Cerrar sesión</span>
                            <HiOutlineLogout className="text-lg sm:text-base" />
                        </button>
                    </form>
            </div>
            );
}