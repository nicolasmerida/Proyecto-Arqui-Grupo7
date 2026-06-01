// app/ui/commands/command-card.tsx
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";

export default function CommandCard() {

    return (
        <div className="flex flex-col border">
            <div className="flex font-semibold text-base text-gray-400 justify-between">
                Comandas <HiOutlineDocumentDuplicate />
            </div>
            <div className="flex text-xl text-black font-serif">
                {/* Cant total comandas */}
            </div>
        </div>
    );
}