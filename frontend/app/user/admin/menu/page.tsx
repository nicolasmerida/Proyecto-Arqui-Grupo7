// app/user/admin/menu/page.tsx
import Menu from "@/app/menu/page";

type SearchParams = {
  page?: string; 
};
type AdminProps = {
  searchParams?: Promise<SearchParams>; 
};

export default async function AdminMenu({ searchParams }: AdminProps) {
    const resolvedParams = await searchParams;

    return (
        // Habilitar edicion de menu
        <Menu searchParams={resolvedParams} editable={true} selectionable={false} />
    );
}