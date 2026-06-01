// app/ui/stock/table-stock.tsx
'use client';
import { Ingrediente } from "@/app/lib/definitions";
import { useState } from "react";
import { HiOutlinePlusSm } from "react-icons/hi";
import AddStock from "@/app/ui/stock/AddStock";

type Condition = "todos" | "regla" | "advertencia" | "bajo";

export default function TableStock() {
    //Consultar ingredientes al backend al inicio con useEffect
    const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
    const [condicion, setCondicion] = useState<Condition>("todos");
    const [showDetail, setShowDetail] = useState(false);
    const [selectedIng, setSelected] = useState<Ingrediente>();
    var ingFiltrados = ingredientes.filter((ingrediente) =>
        (condicion === "regla") ? (ingrediente.stock > ingrediente.stock_mininmo) :
        (condicion === "bajo") ? (ingrediente.stock < ingrediente.stock_mininmo) :
        (condicion === "advertencia") ? (ingrediente.stock === ingrediente.stock_mininmo) :
        true //Para no filtrar y mantener todos los ingredientes
    );

    //Considerar el caso en que se cambie el filtro o cambien los ingredientes totales (useEffect) y testear
    const getCondicion = (ingrediente: Ingrediente): Condition => {
        if (ingrediente.stock > ingrediente.stock_mininmo) return "regla";
        if (ingrediente.stock < ingrediente.stock_mininmo) return "bajo";
        return "advertencia";
    };

    //Abrir componente para modificar el stock
    const handleAddStock = (ingrediente: Ingrediente) => {
        setShowDetail(!showDetail);
        setSelected(ingrediente);
    };

    //Actualizar el stock del ingrediente seleccionado
    const handleStockUpdate = (updatedIng: Ingrediente) => {
        setIngredientes((prev) =>
            prev.map((ing) => (ing.id === updatedIng.id ? updatedIng : ing))
        );
    };

    return (
        <>
        <div className="grid grid-cols-4 rounded-md p-2">
            <button onClick={() => setCondicion("todos")}>Todos</button>
            <button onClick={() => setCondicion("regla")}>En regla</button>
            <button onClick={() => setCondicion("advertencia")}>Advertencia</button>
            <button onClick={() => setCondicion("bajo")}>Bajo</button>
        </div>
        <div className="overflow-hidden rounded-xl border">
            <table className="w-full p-2">
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
                        <tr key={ingrediente.id} className="m-2">
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
                                <button className="rounded-xl" onClick={() => handleAddStock(ingrediente)}>
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
        <AddStock show={showDetail} onClose={() => setShowDetail(false)} onStockUpdate={handleStockUpdate} ingredient={selectedIng} />
        </>
    );
}