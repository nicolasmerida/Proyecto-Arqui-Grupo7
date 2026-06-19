// app/ui/menu/AdminMenuList.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Plato } from '@/app/lib/definitions';
import CourseCard from '@/app/ui/menu/CourseCard';
import { HiOutlinePencil, HiOutlinePlus } from 'react-icons/hi';

interface AdminMenuListProps {
  items: Plato[];
}

export default function AdminMenuList({ items }: AdminMenuListProps) {
  const router = useRouter();
  const [courses] = useState<Plato[]>(items);
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);

  const filteredCourses = !categoryFilter ? courses : courses.filter((course) => course.categoria.nombre ===categoryFilter)

  const openNewCourse = () => {
    router.push('/user/admin/menu/course');
  };

  const openEditCourse = (course: Plato) => {
    router.push(`/user/admin/menu/course/${course.idPlato}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={openNewCourse}
          className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-sky-500"
        >
            <HiOutlinePlus />
            Agregar plato
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.idPlato} className="group">
            <CourseCard course={course} onSelect={() => openEditCourse(course)} />
            <div className="mt-2 flex justify-end opacity-0 transition group-hover:opacity-100">
              <button
                onClick={() => openEditCourse(course)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-400 bg-cyan-200 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-sky-400"
              >
                <HiOutlinePencil />
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}