// app/ui/commands/command-card.tsx
import { Comanda } from "@/app/lib/definitions";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";

interface CommandCardProps {
    commands: Comanda[]
}

export default function CommandCard({ commands }: CommandCardProps) {

    return (
        <div className="flex flex-col border">
            <div className="flex font-semibold text-base text-gray-400 justify-between">
                Comandas <HiOutlineDocumentDuplicate />
            </div>
            <div className="flex text-xl text-black font-serif">
                {/* Cant total comandas */}
                {commands.length}
            </div>
        </div>
    );
}