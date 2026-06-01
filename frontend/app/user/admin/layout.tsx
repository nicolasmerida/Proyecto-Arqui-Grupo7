// app/user/admin/layout.tsx
import FunctionsPanel from "@/app/ui/admin/FunctionsPanel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin",
    default: "Admin",
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="min-h-screen">
          <FunctionsPanel />
          <main className="pl-28 pt-10">
            {children}
          </main>
        </div>
    );
}