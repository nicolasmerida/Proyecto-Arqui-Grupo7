// app/ui/menu/CourseCard.tsx
import { Plato } from "@/app/lib/definitions";
import { notFound } from "next/navigation";
import { HiOutlinePencil, HiOutlineEye } from "react-icons/hi";

interface CourseCardProps {
  course: Plato;
  onSelect: () => void;
  isAdmin?: boolean;
}

const colorByCategory: Record<string, string> = {
  "ENTRADA": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "PRINCIPAL": "bg-blue-100 text-blue-800 border-blue-200",
  "POSTRE": "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
  "BEBIDA": "bg-cyan-100 text-cyan-800 border-cyan-200"
};

export default function CourseCard({ course, onSelect, isAdmin = false }: CourseCardProps) {
  if (!course) return notFound();

  const rawCategoryName = typeof course.categoria === 'string' 
    ? course.categoria 
    : (course.categoria as any)?.nombre || "";

  const categoriaName = rawCategoryName.trim().toUpperCase();

  const categoryColor = colorByCategory[categoriaName] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <div 
      onClick={onSelect}
      className="group relative flex flex-col h-full bg-cyan-500/90 backdrop-blur-md rounded-2xl p-5 border border-blue-400 shadow-md hover:shadow-xl hover:bg-sky-500/90 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1 text-left"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="flex justify-between items-start mb-4 z-10">
        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${categoryColor} uppercase tracking-wider bg-white/90`}>
          {categoriaName}
        </span>
        <div className="bg-white/80 p-2 rounded-full shadow-sm text-sky-800 opacity-0 group-hover:opacity-100 group-hover:text-blue-900 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          {isAdmin ? <HiOutlinePencil size={20} /> : <HiOutlineEye size={20} />}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight z-10 group-hover:text-white transition-colors">{course.nombre}</h3>
      <p className="text-sm text-slate-800 font-medium flex-grow mb-4 line-clamp-3 z-10">{course.descripcion}</p>
      
      <div className="flex justify-between items-center pt-4 border-t border-cyan-300 z-10">
        <span className="text-2xl font-black text-slate-900 tracking-tight">${course.precio.toFixed(2)}</span>
      </div>
    </div>
  );
}