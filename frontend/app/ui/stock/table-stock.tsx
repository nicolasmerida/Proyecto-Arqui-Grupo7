// app/ui/stock/table-stock.tsx
'use client';
import { Ingrediente } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { HiOutlinePlusSm } from "react-icons/hi";
import AddStock from "@/app/ui/stock/AddStock";
import AddIngredient from "@/app/ui/stock/AddIngredient";

type Condition = "todos" | "regla" | "advertencia" | "bajo";

export default function TableStock() {
    //Consultar ingredientes al backend al inicio con useEffect
    const [ingredients, setIngredients] = useState<Ingrediente[]>([]);
    const [condicion, setCondicion] = useState<Condition>("todos");
    const [showDetail, setShowDetail] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [selectedIng, setSelected] = useState<Ingrediente>();

    const fetchIngredients = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ingredientes`)
            if (!response.ok) {
                let errorMessage = `Error ${response.status} inesperado al consultar ingredientes`;
                let errorCode = `ERROR_DESCONOCIDO`;
                try {
                //Intento obtener el mensaje de error desde la API
                const errorData = await response.json();
                if (errorData?.error?.message) {
                    errorMessage = errorData.error.message;
                    errorCode = errorData.error.code || errorCode;
                }
                }
                catch (e) {
                //Se mantiene el mensaje de error por defecto
                }
                //Lanzo el error
                throw new Error(errorMessage, { cause: errorCode });
            }

            const data = await response.json();
            setIngredients(data);
            }
            catch (error) {
                console.error("Error al obtener los ingredientes:", error);
            }
        };
    
    //Consultar ingredientes al backend
    useEffect(() => {
        fetchIngredients();
    }, [])

    var ingFiltrados = ingredients.filter((ingredient) =>
        (condicion === "regla") ? (ingredient.stock > ingredient.stockMinimo) :
        (condicion === "bajo") ? (ingredient.stock < ingredient.stockMinimo) :
        (condicion === "advertencia") ? (ingredient.stock === ingredient.stockMinimo) :
        true //Para no filtrar y mantener todos los ingredientes
    );

    //Considerar el caso en que se cambie el filtro o cambien los ingredientes totales (useEffect) y testear
    const getCondicion = (ingrediente: Ingrediente): Condition => {
        if (ingrediente.stock > ingrediente.stockMinimo) return "regla";
        if (ingrediente.stock < ingrediente.stockMinimo) return "bajo";
        return "advertencia";
    };

    //Abrir componente para modificar el stock
    const handleAddStock = (ingrediente: Ingrediente) => {
        setSelected(ingrediente);
        setShowDetail(true);
    };

    //Actualizar el stock del ingrediente seleccionado
    const handleStockUpdate = (updatedIng: Ingrediente) => {
        setIngredients((prev) =>
            prev.map((ing) => (ing.idIngrediente === updatedIng.idIngrediente ? updatedIng : ing))
        );
    };

    //Abrir componente para agregar/crear un nuevo ingrediente
    const handleCreateIngredient = (nuevo: Ingrediente) => {
        setIngredients((prev) => [...prev, nuevo]);
        //Se debe agregar el nuevo ingrediente a la BD en el backend
        fetchIngredients();
    }

    return (
        <>
        <div className="flex items-center justify-between mb-2">
            <div className="grid grid-cols-4 rounded-md p-2">
                <button onClick={() => setCondicion("todos")}>Todos</button>
                <button onClick={() => setCondicion("regla")}>En regla</button>
                <button onClick={() => setCondicion("advertencia")}>Advertencia</button>
                <button onClick={() => setCondicion("bajo")}>Bajo</button>
            </div>
            <button onClick={() => setShowCreate(true)}
                    className="flex items-center gap-1 rounded-xl bg-green-500 text-white text-base"
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
                        <tr key={ingrediente.idIngrediente} className="m-2">
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
                            <td className="font-medium">
                                <span>{ingrediente.stockMinimo} {ingrediente.unidad}</span>
                            </td>
                            <td>
                                <button onClick={() => handleAddStock(ingrediente)}
                                        className="flex items-center gap-1 rounded-xl border bg-green-500 text-white "
                                >
                                    <HiOutlinePlusSm />Ingreso
                                </button>
                            </td>
                        </tr>
                        );
                        })
                    ) : (
                        <tr>
                            <td className="text-black italic text-center" colSpan={5}>
                                No hay ingredientes para mostrar
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        <AddStock show={showDetail} onClose={() => setShowDetail(false)} onStockUpdate={handleStockUpdate} ingredient={selectedIng} />
        <AddIngredient show={showCreate} onClose={() => setShowCreate(false)} onIngredientCreate={handleCreateIngredient} />
        </>
    );
}