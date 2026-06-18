// app/ui/commands/command-card.tsx
import { Comanda } from "@/app/lib/definitions";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";

interface CommandCardProps {
    commands: Comanda[]
}

export default function CommandCard({ commands }: CommandCardProps) {

    return (
        <div className="flex flex-col border p-4 rounded-md shadow-sm bg-white min-w-[200px]">
            <div className="flex font-semibold text-base text-gray-400 justify-between items-center mb-2">
                <span>Comandas</span>
                <HiOutlineDocumentDuplicate className="text-xl" />
            </div>
            <div className="flex text-3xl font-bold font-serif text-black">
                {commands.length}
            </div>
        </div>
    );
}