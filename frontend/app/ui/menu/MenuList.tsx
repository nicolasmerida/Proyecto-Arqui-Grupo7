// app/ui/menu/MenuList.tsx
'use client';
import { useState } from "react";
import { Category, Plato } from "@/app/lib/definitions";
import CourseCard from "@/app/ui/menu/CourseCard";
import CourseDetail from "@/app/ui/menu/CourseDetail";

interface MenuListProps {
  items: Plato[];
  addItem?: (plato: Plato, notas?: string) => void; // Si se proporciona, muestra botón de agregar a comanda
}

export default function MenuList({ items, addItem }: MenuListProps) {
  const [selectedCourse, setSelectedCourse] = useState<Plato | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [category, setCategory] = useState<Category | null>(null);

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setNotes("");
  };

  const handleAddToCommand = () => {
    if (selectedCourse && addItem) {
      addItem(selectedCourse, notes);
      handleCloseModal();
    }
  };

  const filteredItems = category ? items.filter((item) => item.categoria.nombre === category) : items;

  return (
    <>
      <div className="grid grid-cols-5 items-center p-1 gap-1">
        <button className={`border rounded-lg transition ${category === null ? "text-black bg-amber-200" : "text-slate-400"}`}
                onClick={() => setCategory(null)}>
                  Todos
        </button>
        <button className={`border rounded-lg transition ${category === Category.Entrada ? "text-black bg-amber-200" : "text-slate-400"}`}
                onClick={() => setCategory(Category.Entrada)}>
                  Entradas
        </button>
        <button className={`border rounded-lg transition ${category === Category.Principal ? "text-black bg-amber-200" : "text-slate-400"}`}
                onClick={() => setCategory(Category.Principal)}>
                  Principales
        </button>
        <button className={`border rounded-lg transition ${category === Category.Postre ? "text-black bg-amber-200" : "text-slate-400"}`}
                onClick={() => setCategory(Category.Postre)}>
                  Postres
        </button>
        <button className={`border rounded-lg transition ${category === Category.Bebida ? "text-black bg-amber-200" : "text-slate-400"}`}
                onClick={() => setCategory(Category.Bebida)}>
                  Bebidas
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-6">
        {(filteredItems.length > 0) ? (
          filteredItems.map((item) => (
            <CourseCard
              key={item.id}
              course={item}
              onSelect={() => setSelectedCourse(item)}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-slate-500">
            No hay platos disponibles.
          </p>
        )}
      </div>

      {selectedCourse && (
        <CourseDetail
          isVisible={true}
          course={selectedCourse}
          notes={notes}
          onNotesChange={setNotes}
          onAddToCommand={addItem ? handleAddToCommand : undefined}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}