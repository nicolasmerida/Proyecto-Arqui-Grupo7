// app/ui/commands/command-card.tsx
import { ComandaResumen } from "@/app/lib/definitions";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";

interface CommandCardProps {
    commands: ComandaResumen[]
}

export default function CommandCard({ commands }: CommandCardProps) {
    return (
        <div className="flex flex-col bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex font-semibold text-sm text-slate-500 justify-between items-center mb-4">
                <span className="uppercase tracking-wider">Comandas</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <HiOutlineDocumentDuplicate size={20} />
                </div>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-800 tracking-tight">
                    {commands.length}
                </span>
            </div>
        </div>
    );
}