// app/user/mozo/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Mozo',
};

export default function MozoLayout({ children }: { children: React.ReactNode }) {

    return (
        <main>
            {children}
        </main>
    );
}