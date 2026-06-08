// app/user/admin/menu/course/page.tsx
import AddCourseForm from "@/app/ui/forms/AddCourseForm";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

export const metadata: Metadata = {
  title: 'Crear plato',
};

export default function CourseCreatePage() {

    return (
    <main className="px-5 py-6">
        <AddCourseForm />
    </main>
    );
}
