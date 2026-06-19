// app/user/admin/layout.tsx
import FunctionsPanel from "@/app/ui/admin/FunctionsPanel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin",
    default: "Admin",
  },
};

import { GoogleExportProvider } from "@/app/ui/admin/GoogleExportProvider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

    return (
        <GoogleExportProvider>
            <div className="min-h-screen">
              <FunctionsPanel />
              <main className="border-l pl-36 pt-10">
                {children}
              </main>
            </div>
        </GoogleExportProvider>
    );
}