// app/ui/staff/staff-card.tsx
import { HiOutlineUserGroup } from "react-icons/hi2";

export default function StaffCard() {

    return (
        <div className="flex flex-col border">
            <div className="flex font-semibold text-base text-gray-400 justify-between">
                Mozos activos <HiOutlineUserGroup />
            </div>
            <div className="flex text-xl text-black font-serif">
                {/* Cant mozos activos */}
            </div>
            <div className="text-sm text-gray-400">
                {/* Cant mozos total */} staff total
            </div>
        </div>
    );
}