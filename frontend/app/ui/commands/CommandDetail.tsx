// app/ui/mozo/CommandDetail.tsx
import { Item_Pedido } from "@/app/lib/definitions";
import { HiOutlineCash } from "react-icons/hi";

interface CommandDetailProps {
    items: Item_Pedido[];
}

export default function CommandDetail({items} : CommandDetailProps) {

    const handlePay = () => {
        //Enviar detalles de comanda y pago al backend
        //Cerrar mesa
    }

    return(
        <div className="flex flex-col">
            Detalle comanda
            <div>
                <button onClick={handlePay}>
                    <HiOutlineCash /> Confirmar y pagar
                </button>
            </div>
        </div>
    );
}