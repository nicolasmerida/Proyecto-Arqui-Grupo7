// app/user/mozo/menu/page.tsx
// Server component: lee params y fetcha los platos del menú
import MozoMenuClient from "@/app/ui/mozo/MozoMenuClient";
import { Plato } from "@/app/lib/definitions";

type SearchParams = { page?: string; comanda?: string };

export default async function MozoMenuPage({
    searchParams,
}: {
    searchParams?: Promise<SearchParams>;
}) {
    const params = await searchParams;
    const numeroComanda = Number(params?.comanda ?? 0);
    const page = Number(params?.page ?? 1);

    let platos: Plato[] = [];
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/menu?page=${page - 1}`,
            { cache: 'no-store' }
        );
        if (res.ok) {
            const data = await res.json();
            platos = data.content ?? [];
        }
    } catch {
        // Si el backend no responde, el cliente verá la lista vacía
    }

    return <MozoMenuClient platos={platos} numeroComanda={numeroComanda} />;
}
