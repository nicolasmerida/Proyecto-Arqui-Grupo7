// app/ui/menu/CourseDetail.tsx
'use client';
import { Plato } from "@/app/lib/definitions";
import { useEffect, useRef } from "react";
import { HiOutlineX } from "react-icons/hi";

interface CourseDetailProps {
    isVisible: boolean;
    course: Plato;
    notes: string;
    onNotesChange: (notes: string) => void;
    onAddToCommand?: () => void; // Opcional: si no se proporciona, no muestra el botón de agregar
    onClose: () => void;
}

export default function CourseDetail({ isVisible, course, notes, onNotesChange, onAddToCommand, onClose }: CourseDetailProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isVisible) {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        }
        else {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isVisible, onClose]);

    if (!isVisible)
        return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const backdropClasses = `
        fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 
        flex justify-center items-center transition-opacity duration-300 ease-in-out
    `;

    return (
        <div className={backdropClasses} onClick={handleOverlayClick}>
            <div
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
                className="bg-cyan-500 rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col justify-start">
                        <h2 className="text-2xl font-bold text-slate-900">{course.nombre}</h2>
                        <p className="text-sm text-slate-700 mt-1">
                            {course.categoria.nombre}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-700 transition"
                        aria-label="Cerrar"
                    >
                        <HiOutlineX size={24} />
                    </button>
                </div>

                {/* Descripción */}
                <div className="mb-4 pb-4 border-b border-slate-500">
                    <p className="text-slate-700">{course.descripcion}</p>
                </div>

                {/* Precio */}
                <div className="mb-6 flex items-center justify-between bg-slate-500 p-3 rounded-lg">
                    <span className="text-slate-700 font-medium">Precio:</span>
                    <span className="text-2xl font-bold text-slate-900">${course.precio}</span>
                </div>

                {/* Notas */}
                {onAddToCommand && (
                    <div className="mb-6">
                        <label htmlFor="notas" className="block text-sm font-medium text-black mb-2">
                            Notas de la comanda (opcional)
                        </label>
                        <textarea
                            id="notas"
                            value={notes}
                            onChange={(e) => onNotesChange(e.target.value)}
                            placeholder="Notas del plato para la preparación"
                            className="w-full px-3 py-2 text-slate-400 border border-sky-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            rows={3}
                        />
                    </div>
                )}

                {/* Acciones */}
                {onAddToCommand ? (
                    <div className="flex gap-3">
                        <button
                            onClick={onAddToCommand}
                            className="flex-1 px-4 py-2 bg-sky-500 text-slate-400 font-medium rounded-lg hover:bg-blue-500 transition"
                        >
                            Agregar a comanda
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-slate-500 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
                        >
                            Cancelar
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition"
                        >
                            Cerrar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}