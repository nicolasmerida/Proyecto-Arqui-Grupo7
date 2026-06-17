// app/user/mozo/menu/page.tsx
'use client';
import { EstadoItem, Item_Pedido, Plato } from "@/app/lib/definitions";
import Menu from "@/app/menu/page";
import CommandDetail from "@/app/ui/commands/CommandDetail";
import { useState, use } from "react";
import { useRouter } from "next/navigation";

type SearchParams = {
    page?: string;
    comanda?: string;
};
type MozoProps = {
    searchParams?: Promise<SearchParams>;
};

export default function MozoMenu({ searchParams }: MozoProps) {
    const params = searchParams ? use(searchParams) : undefined;
    const numeroComanda = Number(params?.comanda);
    const [itemsComanda, setItemsComanda] = useState<Item_Pedido[]>([]); // Lista de platos seleccionados localmente
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const agregarItem = (plato: Plato, nota?: string) => {
        const notas = nota ?? "";

        setItemsComanda((prev) => {
            const index = prev.findIndex((item) => item.numeroComanda === numeroComanda && item.idPlato === plato.idPlato && item.notas.trim() === notas.trim());
            if (index !== -1) {
                return prev.map((item, i) =>
                    (i === index) ?
                        {
                            ...item,
                            cantidad: item.cantidad + 1,
                        } :
                        item
                );
            }
            return [...prev, {
                numeroComanda,
                idPlato: plato.idPlato,
                nombrePlato: plato.nombre,
                precio: plato.precio,
                cantidad: 1,
                notas,
                estadoItem: EstadoItem.Pendiente,
            }];
        })
    };

    const handleConfirmOrder = async () => {
        if (itemsComanda.length === 0) return;
        setIsSubmitting(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

            // Enviamos cada item al backend
            const requests = itemsComanda.map(item =>
                fetch(`${baseUrl}/api/items-pedido`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(item)
                })
            );

            const responses = await Promise.all(requests);

            const hasErrors = responses.some(res => !res.ok);
            if (hasErrors) {
                alert("Hubo un error al enviar algunos ítems a la cocina. Por favor, reintente.");
                setIsSubmitting(false);
                return;
            }

            // Éxito: volvemos al mapa del salón
            router.push('/user/mozo');

        } catch (error) {
            console.error("Error al enviar el pedido:", error);
            alert("Ocurrió un error al enviar el pedido.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-row relative h-screen">
            <div className="flex-1 overflow-y-auto">
                <Menu searchParams={searchParams} addItem={agregarItem} />
            </div>
            <CommandDetail
                items={itemsComanda}
                onConfirm={handleConfirmOrder}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}