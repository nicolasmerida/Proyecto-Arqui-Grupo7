// app/ui/staff/staff-card.tsx
import { HiOutlineUserGroup } from "react-icons/hi2";

export default function StaffCard() {

    return (
        <div className="flex flex-col">
            <div className="flex justify-between">
                Mozos activos <HiOutlineUserGroup />
            </div>
        </div>
    );
}