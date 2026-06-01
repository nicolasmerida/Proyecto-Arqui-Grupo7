// app/user/layout.tsx
import Userbar from "@/app/ui/Userbar";

export default function UserLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="min-h-screen">
            <Userbar />
            <main className="flex-1 pt-10">
                {children}
            </main>
        </div>
    );
}