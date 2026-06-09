// app/ui/stock/table-stock.tsx
'use client';
import { Ingrediente } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { HiOutlinePlusSm } from "react-icons/hi";
import AddStock from "@/app/ui/stock/AddStock";
import CreateIngrediente from "@/app/ui/stock/CreateIngrediente";

type Condition = "todos" | "regla" | "advertencia" | "bajo";

export default function TableStock() {
    const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
    const [condicion, setCondicion] = useState<Condition>("todos");
    const [showIngreso, setShowIngreso] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [selectedIng, setSelectedIng] = useState<Ingrediente | undefined>();

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ingredientes`)
            .then(res => res.json())
            .then(setIngredientes)
            .catch(console.error);
    }, []);

    const ingFiltrados = ingredientes.filter((ingrediente) =>
        condicion === "regla"      ? ingrediente.stock > ingrediente.stockMinimo :
        condicion === "bajo"       ? ingrediente.stock < ingrediente.stockMinimo :
        condicion === "advertencia"? ingrediente.stock === ingrediente.stockMinimo :
        true
    );

    const getCondicion = (ingrediente: Ingrediente): Condition => {
        if (ingrediente.stock > ingrediente.stockMinimo) return "regla";
        if (ingrediente.stock < ingrediente.stockMinimo) return "bajo";
        return "advertencia";
    };

    const handleAbrirIngreso = (ingrediente: Ingrediente) => {
        setSelectedIng(ingrediente);
        setShowIngreso(true);
    };

    const handleStockUpdate = (updatedIng: Ingrediente) => {
        setIngredientes(prev =>
            prev.map(ing => ing.idIngrediente === updatedIng.idIngrediente ? updatedIng : ing)
        );
    };

    return (
        <>
        <div className="flex justify-between items-center mb-2">
            <div className="grid grid-cols-4 rounded-md p-2 gap-1">
                <button onClick={() => setCondicion("todos")}>Todos</button>
                <button onClick={() => setCondicion("regla")}>En regla</button>
                <button onClick={() => setCondicion("advertencia")}>Advertencia</button>
                <button onClick={() => setCondicion("bajo")}>Bajo</button>
            </div>
            <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-black text-white text-sm"
            >
                <HiOutlinePlusSm /> Nuevo ingrediente
            </button>
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
                    {ingFiltrados.length > 0 ? (
                        ingFiltrados.map((ingrediente) => {
                            const cond = getCondicion(ingrediente);
                            const condTexto = cond === "regla" ? "En regla" : cond === "bajo" ? "Bajo" : "Advertencia";
                            const condEstilo = cond === "regla"
                                ? "text-green-500 bg-green-300 border-green-500"
                                : cond === "bajo"
                                ? "text-red-500 bg-red-300 border-red-500"
                                : "text-black bg-gray-500 border-black";

                            return (
                                <tr key={ingrediente.idIngrediente} className="m-2">
                                    <td className="font-medium">{ingrediente.nombre}</td>
                                    <td>
                                        <span className="font-semibold font-serif">{ingrediente.stock}</span>&nbsp;
                                        <span className="font-serif">{ingrediente.unidad}</span>
                                    </td>
                                    <td className={`rounded-xl border ${condEstilo}`}>{condTexto}</td>
                                    <td>
                                        <span className="font-serif">{ingrediente.stockMinimo} {ingrediente.unidad}</span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleAbrirIngreso(ingrediente)}
                                            className="flex items-center gap-1 px-2 py-1 rounded-lg border text-sm hover:bg-gray-100"
                                        >
                                            <HiOutlinePlusSm /> Ingreso
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-black italic text-center py-4">
                                No hay ingredientes para mostrar
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        <AddStock
            show={showIngreso}
            onClose={() => setShowIngreso(false)}
            onStockUpdate={handleStockUpdate}
            ingredient={selectedIng}
        />
        <CreateIngrediente
            show={showCreate}
            onClose={() => setShowCreate(false)}
            onCreated={(nuevo) => setIngredientes(prev => [...prev, nuevo])}
        />
        </>
    );
}
