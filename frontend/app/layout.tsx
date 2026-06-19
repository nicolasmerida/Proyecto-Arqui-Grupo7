import "@/app/ui/globals.css";
import Navbar from "@/app/ui/navbar";
import Footer from "@/app/ui/footer";
import Userbar from "@/app/ui/Userbar";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: {
    template: "%s | SGR",
    default: "Sistema de Gestión de Restaurante",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>

      <body className="flex flex-col min-h-screen">
        <SessionProvider session={session}>
          <Userbar />
          <Navbar />
          <main className="flex-auto">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}