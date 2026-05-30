// app/ui/stock/table-stock.tsx
'use client';
import { Ingrediente } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { HiOutlinePlusSm } from "react-icons/hi";

export default function TableStock() {
    //Consultar ingredientes al backend
    const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
    const [condicion, setCondicion] = useState("todo");
    var ingFiltrados = ingredientes.filter((ingrediente) => {
        (condicion === "regla") ? (ingrediente.stock > ingrediente.stock_mininmo) :
        (condicion === "bajo") ? (ingrediente.stock < ingrediente.stock_mininmo) :
        (condicion === "advertencia") ? (ingrediente.stock === ingrediente.stock_mininmo) :
        true //Para no filtrar y mantener todos los ingredientes
        }
    );
    //Considerar el caso en que se cambie el filtro o cambien los ingredientes totales (useEffect) y testear
    const getCondicion = (ingrediente: Ingrediente) => {
        if (ingrediente.stock > ingrediente.stock_mininmo) return "regla";
        if (ingrediente.stock < ingrediente.stock_mininmo) return "bajo";
        if (ingrediente.stock === ingrediente.stock_mininmo) return "advertencia";
    };

    const handleIngreso = (ingrediente: Ingrediente) => {
        // Invocar la función registrar aumento stock de ingrediente
    };

    return(
        <>
        <div className="grid grid-cols-3 rounded-md p-2">
            <button onClick={() => setCondicion("todos")}>Todos</button>
            <button onClick={() => setCondicion("regla")}>En regla</button>
            <button onClick={() => setCondicion("advertencia")}>Advertencia</button>
            <button onClick={() => setCondicion("bajo")}>Bajo</button>
        </div>
        <div className="overflow-hidden rounded-xl border">
            <table className="w-full">
                <thead>
                    <tr className="text-left text-sm uppercase">
                        <th>Ingrediente</th>
                        <th>Stock actual</th>
                        <th>Condición</th>
                        <th>Mínimo</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {(ingFiltrados.length > 0) ? (
                    ingFiltrados.map((ingrediente) => {
                        const condIngrediente = getCondicion(ingrediente);
                        const condTexto = (condIngrediente === "regla") ? "En regla" :
                                            (condIngrediente === "bajo") ? "Bajo" :
                                            "Advertencia";
                        const condEstilo = (condIngrediente === "regla") ? "text-green-500 bg-green-300 border-green-500" :
                                            (condIngrediente === "bajo") ? "text-red-500 bg-red-300 border-red-500" :
                                            "text-black bg-gray-500 border-black";

                        return (
                        <tr key={ingrediente.id}>
                            <td className="font-medium">
                                {ingrediente.nombre}
                            </td>
                            <td>
                                <span className="font-semibold font-serif">{ingrediente.stock}</span>&nbsp
                                <span className="font-serif">{ingrediente.unidad}</span>
                            </td>
                            <td className={`rounded-xl border ${condEstilo}`}>
                                {condTexto}
                            </td>
                            <td>
                                <button className="rounded-xl" onClick={() => handleIngreso(ingrediente)}>
                                    <HiOutlinePlusSm />Ingreso
                                </button>
                            </td>
                        </tr>
                        );
                        })
                    ) : (
                        <tr>
                            <td className="text-black italic">
                                No hay ingredientes para mostrar
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        </>
    );
}