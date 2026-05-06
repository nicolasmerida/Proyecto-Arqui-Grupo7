// app/layout.tsx
import type { Metadata } from "next";
import Navbar from "./ui/navbar";
import Footer from "./ui/footer";

export const metadata: Metadata = {
  title: {
    template: '%s | Sistema de Gestión de Restaurante',
    default: 'Sistema de Gestión de Restaurante',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <Navbar />
      <main className="min-h-full flex flex-col">{children}</main>
      <Footer />
    </html>
  );
}
