// app/ui/menu/CourseCard.tsx
import { Plato } from "@/app/lib/definitions";
import { notFound } from "next/navigation";

interface CourseCardProps {
  course: Plato;
  onSelect: () => void;
}

export default function CourseCard({ course, onSelect }: CourseCardProps) {
  if (!course)
    return notFound();

  return (
    <button
      onClick={onSelect}
      className="h-full border border-slate-300 rounded-lg p-4 hover:shadow-lg transition-shadow text-left bg-white hover:bg-slate-50 cursor-pointer"
    >
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-slate-500 uppercase">
            {course.categoria.nombre}
        </span>
        <h3 className="text-lg font-semibold font-serif text-slate-900">{course.nombre}</h3>
        <p className="text-sm text-slate-600">{course.descripcion}</p>
        <div className="flex justify-between items-center pt-2 border-t border-slate-200">
          <span className="text-lg font-bold text-slate-900">${course.precio}</span>
        </div>
      </div>
    </button>
  );
}