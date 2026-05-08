// app/menu/course/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseDetail from "@/app/ui/menu/CourseDetail";

export const metadata: Metadata = {
    title: "Plato",
}

export default async function CourseInfo(props: { params: Promise<{ id: string }> }) {
    const course_id = (await props.params).id;
    const courseId = parseInt(course_id);
    const course; //Obtener plato desde la BD del backend

  if (!course) return notFound();

  return <CourseDetail course={course} />;
}