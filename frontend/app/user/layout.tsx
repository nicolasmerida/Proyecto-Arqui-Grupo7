<<<<<<< HEAD
// app/user/layout.tsx

export default function UserLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen">
      <main className="flex-1 pt-10">
        {children}
      </main>
    </div>
  );
=======
import Userbar from "@/app/ui/Userbar";
import GoogleAuthProvider from "@/app/ui/GoogleAuthProvider";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <GoogleAuthProvider>
      <div className="min-h-screen">
        <Userbar />
        <main className="flex-1 pt-10">{children}</main>
      </div>
    </GoogleAuthProvider>
  );
>>>>>>> f4091dd2a37b03ec9350652e62b64a5b2dacd1e2
}