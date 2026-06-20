// app/user/layout.tsx

import Userbar from "@/app/ui/Userbar";
import GoogleAuthProvider from "@/app/ui/GoogleAuthProvider";

export default function UserLayout({ children }: { children: React.ReactNode }) {

  return (
    <GoogleAuthProvider>
      <Userbar />
      <div className="min-h-screen">
        <main className="flex-1 pt-10">
          {children}
        </main>
      </div>
    </GoogleAuthProvider>
  );
}