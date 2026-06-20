// app/ui/menu/CourseCard.tsx
import { Plato } from "@/app/lib/definitions";
import { notFound } from "next/navigation";
import { HiOutlinePencil, HiOutlineEye } from "react-icons/hi";

interface CourseCardProps {
  course: Plato;
  onSelect?: () => void;
  isAdmin?: boolean;
  isInteractive?: boolean;
}

const colorByCategory: Record<string, string> = {
  "ENTRADA": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "PRINCIPAL": "bg-blue-100 text-blue-800 border-blue-200",
  "POSTRE": "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
  "BEBIDA": "bg-cyan-100 text-cyan-800 border-cyan-200"
};

export default function CourseCard({ course, onSelect, isAdmin = false, isInteractive = true }: CourseCardProps) {
  if (!course) return notFound();

  const rawCategoryName = typeof course.categoria === 'string' 
    ? course.categoria 
    : (course.categoria as any)?.nombre || "";

  const categoriaName = rawCategoryName.trim().toUpperCase();

  const categoryColor = colorByCategory[categoriaName] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <div 
      onClick={isInteractive ? onSelect : undefined}
      className={`relative flex flex-col h-full bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-slate-200 shadow-md text-left overflow-hidden ${
        isInteractive 
          ? 'group hover:shadow-xl hover:bg-slate-50 transition-all duration-300 cursor-pointer transform hover:-translate-y-1' 
          : ''
      }`}
    >
      <div className={`absolute inset-0 bg-linear-to-br from-slate-100/50 to-transparent opacity-0 transition-opacity pointer-events-none ${isInteractive ? 'group-hover:opacity-100' : ''}`} />
      
      <div className="flex justify-between items-start mb-4 z-10">
        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${categoryColor} uppercase tracking-wider`}>
          {categoriaName}
        </span>
        {isInteractive && (
          <div className="bg-slate-100 p-2 rounded-full shadow-sm text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-amber-600 group-hover:bg-amber-50 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
            {isAdmin ? <HiOutlinePencil size={20} /> : <HiOutlineEye size={20} />}
          </div>
        )}
      </div>
      
      <h3 className={`text-xl font-bold text-slate-900 mb-2 leading-tight z-10 transition-colors ${isInteractive ? 'group-hover:text-amber-700' : ''}`}>{course.nombre}</h3>
      <p className="text-sm text-slate-600 font-medium grow mb-4 line-clamp-3 z-10">{course.descripcion}</p>
      
      <div className="flex justify-between items-center pt-4 border-t border-slate-200 z-10">
        <span className="text-2xl font-black text-slate-900 tracking-tight">${course.precio.toFixed(2)}</span>
      </div>
    </div>
  );
}