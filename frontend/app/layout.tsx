// app/layout.tsx
import "./ui/globals.css"
import type { Metadata } from "next";
import Navbar from "./ui/navbar";
import Footer from "./ui/footer";

export const metadata: Metadata = {
  title: {
    template: '%s | SGR',
    default: 'Sistema de Gestión de Restaurante',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-auto">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
