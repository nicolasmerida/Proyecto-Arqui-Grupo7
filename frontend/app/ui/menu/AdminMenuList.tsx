// app/ui/menu/AdminMenuList.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Plato } from '@/app/lib/definitions';
import CourseCard from '@/app/ui/menu/CourseCard';
import { HiOutlinePlus, HiOutlineViewGrid } from 'react-icons/hi';

interface AdminMenuListProps {
  items: Plato[];
}

export default function AdminMenuList({ items }: AdminMenuListProps) {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);

  const filteredCourses = !categoryFilter 
    ? items 
    : items.filter((course) => {
        const catName = typeof course.categoria === 'string' 
          ? course.categoria 
          : (course.categoria as any)?.nombre;
        
        if (!catName) return false;
        
        return catName.trim().toUpperCase() === categoryFilter.trim().toUpperCase();
      });

  const openNewCourse = () => {
    router.push('/user/admin/menu/course');
  };

  const openEditCourse = (course: Plato) => {
    router.push(`/user/admin/menu/course/${course.idPlato}`);
  };

  return (
    <div className="space-y-8">
      {/* Barra de Herramientas Premium */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <button 
            onClick={() => setCategoryFilter(null)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${categoryFilter === null ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
          >
            Todos
          </button>
          {Object.values(Category).map((cat) => (
            <button 
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${categoryFilter === cat ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={openNewCourse}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-amber-500 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <HiOutlinePlus size={20} />
          Nuevo Plato
        </button>
      </div>

      {filteredCourses.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm border-2 border-dashed border-amber-300 rounded-3xl">
           <HiOutlineViewGrid size={48} className="text-amber-400 mb-4" />
           <p className="text-xl font-bold text-slate-700">No hay platos en esta categoría.</p>
           <p className="text-slate-500 mt-2">Prueba seleccionar otra categoría o crear uno nuevo.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.idPlato} course={course} onSelect={() => openEditCourse(course)} isAdmin={true} />
          ))}
        </div>
      )}
    </div>
  );
}