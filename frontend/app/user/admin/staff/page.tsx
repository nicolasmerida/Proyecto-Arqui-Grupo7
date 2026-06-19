// app/user/admin/staff/page.tsx
import TableStaff from "@/app/ui/staff/table-staff";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Staff',
};

export default function Staff() {
    return(
        <div className="min-h-screen bg-slate-50/50 pb-10">
            {/* Header Premium */}
            <div className="bg-white border-b border-slate-200 px-8 py-8 shadow-sm">
                <h1 className="text-3xl font-bold font-serif italic text-slate-900">Personal del Restaurante</h1>
                <p className="text-slate-500 mt-1">Gestión de usuarios, mozos y cocineros</p>
            </div>

            <main className="px-8 py-6 max-w-7xl mx-auto space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1">
                    <TableStaff />
                </div>
            </main>
        </div>
    );
}