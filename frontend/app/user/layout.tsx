// app/user/layout.tsx
import Userbar from "@/app/ui/Userbar";

export default function UserLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="flex flex-col min-h-screen">
            <Userbar />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}