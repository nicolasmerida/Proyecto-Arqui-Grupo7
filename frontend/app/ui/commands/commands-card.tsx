// app/ui/commands/commands-card.tsx
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";

export default function CommandsCard() {

    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                Comandas <HiOutlineDocumentDuplicate />
            </div>
        </div>
    );
}