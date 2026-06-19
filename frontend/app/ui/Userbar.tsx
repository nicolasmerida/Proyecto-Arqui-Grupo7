// app/ui/Userbar.tsx
import { HiOutlineLogout } from "react-icons/hi";
import { auth, signOut } from "@/auth";

export default async function Userbar() {
    const session = await auth();

    return (
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
            </div>
        </nav>
    );
}