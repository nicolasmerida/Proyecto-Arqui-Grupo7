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

  const filteredItems = !category 
    ? items 
    : items.filter((item) => {
        const catName = typeof item.categoria === 'string' 
          ? item.categoria 
          : (item.categoria as any)?.nombre;
        
        if (!catName) return false;
        
        return catName.trim().toUpperCase() === category.trim().toUpperCase();
      });
  const isInteractive = !!addItem;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-center items-center bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-2xl border border-blue-200 shadow-sm gap-2 sm:gap-4 mb-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${category === null ? 'bg-sky-500 text-white shadow-md' : 'bg-transparent text-slate-700 hover:bg-sky-100'}`}
                  onClick={() => setCategory(null)}>
                    Todos
          </button>
          <button className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${category === Category.Entrada ? 'bg-sky-500 text-white shadow-md' : 'bg-transparent text-slate-700 hover:bg-sky-100'}`}
                  onClick={() => setCategory(Category.Entrada)}>
                    Entradas
          </button>
          <button className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${category === Category.Principal ? 'bg-sky-500 text-white shadow-md' : 'bg-transparent text-slate-700 hover:bg-sky-100'}`}
                  onClick={() => setCategory(Category.Principal)}>
                    Principales
          </button>
          <button className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${category === Category.Postre ? 'bg-sky-500 text-white shadow-md' : 'bg-transparent text-slate-700 hover:bg-sky-100'}`}
                  onClick={() => setCategory(Category.Postre)}>
                    Postres
          </button>
          <button className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${category === Category.Bebida ? 'bg-sky-500 text-white shadow-md' : 'bg-transparent text-slate-700 hover:bg-sky-100'}`}
                  onClick={() => setCategory(Category.Bebida)}>
                    Bebidas
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-6">
        {(filteredItems.length > 0) ? (
          filteredItems.map((item) => (
            <CourseCard
              key={item.idPlato}
              course={item}
              onSelect={isInteractive ? () => setSelectedCourse(item) : undefined}
              isInteractive={isInteractive}
            />
          ))
        ) : (
          <p className="col-span-full text-center italic text-slate-200 text-lg font-medium bg-slate-800/50 py-8 rounded-xl border border-slate-600/50">
            No hay platos disponibles en esta categoría.
          </p>
        )}
      </div>

      {isInteractive && selectedCourse && (
        <CourseDetail
          isVisible={true}
          course={selectedCourse}
          notes={notes}
          onNotesChange={setNotes}
          onAddToCommand={handleAddToCommand}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}