// app/user/mozo/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Mozo',
};

export default function MozoLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="bg-[url('/bg_mozo.jpeg')] bg-cover bg-center bg-fixed min-h-screen">
            {children}
        </div>
    );
}