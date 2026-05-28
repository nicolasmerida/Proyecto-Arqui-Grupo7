// app/menu/course/[id]/page.tsx
'use client';

import { Plato } from "@/app/lib/definitions";
import CourseDetail from "@/app/ui/menu/CourseDetail";
import { useState } from "react";
import { notFound } from "next/navigation";

interface CourseProps {
  course: Plato;
  select: boolean;
  edit: boolean;
  addItem: (plato: Plato, notas?: string) => void;
}

export default async function CourseInfo({ course, select, edit, addItem } : CourseProps) {
  const [showDetail, setShowDetail] = useState(false);

  if (!course) return notFound();

  const handleCloseDetail = () => {
    setShowDetail(false);
  }

  return (
    <div> {/* Agregar margen superior segun Navbar */}
      {/*Detalles del plato */}
      <CourseDetail isVisible={showDetail} course={course} onClose={handleCloseDetail} selectionable={select} editable={edit} addItem={addItem} />
    </div>
  );
}