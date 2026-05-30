// app/user/admin/menu/page.tsx
import Menu from "@/app/menu/page";

type SearchParams = {
  page?: string; 
};
interface AdminProps {
  searchParams?: Promise<SearchParams>; 
};

export default function AdminMenu({ searchParams }: AdminProps) {

    return (
        // Habilitar edicion de menu
        <Menu searchParams={searchParams} editable={true} selectionable={false} />
    );
}