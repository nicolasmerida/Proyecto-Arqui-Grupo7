// app/user/mozo/menu/page.tsx
'use client';
import { EstadoItem, Item_Pedido, Plato } from "@/app/lib/definitions";
import Menu from "@/app/menu/page";
import CommandDetail from "@/app/ui/commands/CommandDetail";
import CourseDetail from "@/app/ui/menu/CourseDetail";
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

            const itemsFallidos = itemsComanda.filter((_, index) => !responses[index].ok);

            if (itemsFallidos.length > 0) {
                // Actualizamos el carrito para dejar SOLO los que fallaron, 
                // así no re-enviamos duplicados a la cocina en el próximo intento.
                setItemsComanda(itemsFallidos);
                
                try {
                    const errorResponse = responses.find(res => !res.ok);
                    const errorData = await errorResponse!.json();
                    alert(`Error del sistema: ${errorData.error?.message || 'Error desconocido'}`);
                } catch(e) {
                    alert("Hubo un error al enviar algunos ítems a la cocina. Por favor, reintente.");
                }
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

    const updateQuantity = (index: number, delta: number) => {
        setItemsComanda(prev => {
            const newItems = [...prev];
            const item = { ...newItems[index] }; // COPIA el objeto para evitar bugs de mutación en React Strict Mode
            if (item.cantidad + delta > 0) {
                item.cantidad += delta;
            } else {
                // Si la cantidad llega a 0, opcionalmente se puede eliminar. Aquí solo no dejamos bajar de 1.
                // Para eliminar, se usa el botón de basurero.
            }
            newItems[index] = item;
            return newItems;
        });
    };

    const removeItem = (index: number) => {
        setItemsComanda(prev => prev.filter((_, i) => i !== index));
    };

    // --- Lógica de Edición de Notas ---
    const [selectedEditIndex, setSelectedEditIndex] = useState<number | null>(null);
    const [editPlatoData, setEditPlatoData] = useState<Plato | null>(null);
    const [editNotes, setEditNotes] = useState<string>("");

    const handleEditItem = async (index: number) => {
        const item = itemsComanda[index];
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
            const response = await fetch(`${baseUrl}/api/platos/${item.idPlato}`);
            if (response.ok) {
                const plato = await response.json();
                setEditPlatoData(plato);
                setEditNotes(item.notas || "");
                setSelectedEditIndex(index);
            }
        } catch (error) {
            console.error("Error cargando detalles del plato para editar", error);
        }
    };

    const saveEditItem = () => {
        if (selectedEditIndex !== null) {
            setItemsComanda(prev => {
                const newItems = [...prev];
                const item = { ...newItems[selectedEditIndex] };
                item.notas = editNotes;
                newItems[selectedEditIndex] = item;
                return newItems;
            });
            setSelectedEditIndex(null);
            setEditPlatoData(null);
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
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onEditItem={handleEditItem}
            />

            {/* Modal de edición reutilizando CourseDetail */}
            {editPlatoData && selectedEditIndex !== null && (
                <CourseDetail
                    isVisible={true}
                    course={editPlatoData}
                    notes={editNotes}
                    onNotesChange={setEditNotes}
                    onAddToCommand={saveEditItem} 
                    onClose={() => { setSelectedEditIndex(null); setEditPlatoData(null); }}
                />
            )}
        </div>
    );
}