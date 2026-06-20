// app/user/cocinero/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Cocinero',
};

export default function CocineroLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="bg-[url('/bg_cocinero.jpeg')] bg-cover bg-center bg-fixed min-h-screen">
            {children}
        </div>
    );
}