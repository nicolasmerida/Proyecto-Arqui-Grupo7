// app/user/layout.tsx

export default function UserLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="min-h-screen">
            <main className="flex-1 pt-10">
                {children}
            </main>
        </div>
    );
}