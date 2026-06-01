// app/user/cocinero/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Cocinero',
};

export default function CocineroLayout({ children }: { children: React.ReactNode }) {

    return (
        <main>
            {children}
        </main>
    );
}