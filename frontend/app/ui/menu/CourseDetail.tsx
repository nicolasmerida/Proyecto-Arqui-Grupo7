// app/ui/menu/CourseDetail.tsx
'use client';

import { Category, Plato } from "@/app/lib/definitions";
import { useEffect, useRef, useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";

interface CourseDetailProps {
    isVisible?: boolean;
    course: Plato;
    onClose: () => void;
    selectionable: boolean;
    editable: boolean;
    addItem: () => void;
}

const CAT_OPTIONS = Object.values(Category) as Category[];

export default function CourseDetail({isVisible, course, onClose, selectionable, editable, addItem} : CourseDetailProps) {
    const [precio, setPrecio] = useState<number>(course.precio);
    const [descripcion, setDescripcion] = useState<string>(course.descripcion);
    const [categoria, setCategoria] = useState<Category>(course.categoria.nombre);
    const inputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (isVisible && inputRef.current) {
            inputRef.current.focus();
        }

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

    const backdropClasses = `
    fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 
    flex justify-center items-start pt-20 transition-opacity duration-300 ease-in-out
    ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
    `;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={backdropClasses} onClick={handleOverlayClick}>
            <div className="" ref={modalRef} onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-rox rounded-md text-white">
                    <div className="justify-center text-lg">
                        <strong>{course.nombre}</strong>
                    </div>
                    <div className="flex flex-row justify-start gap-1 text-base">
                        <strong>Descripcion: </strong>
                        {(editable) ?
                            <input
                                id="descripcion"
                                name="descripcion"
                                type="text"
                                placeholder="Descripción del plato"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                            /> :
                            (course.descripcion)
                        }
                    </div>
                    <div className="flex flex-row justify-start gap-1 text-base">
                        <strong>Categoria: </strong>
                        {(editable) ?
                            <div className="flex gap-6 mb-6">
                                {CAT_OPTIONS.map(cat => (
                                    <label key={cat} className="flex items-center gap-2 text-white/80 cursor-pointer">
                                        <input
                                        type="radio"
                                        name="role"
                                        value={cat}
                                        checked={categoria === cat}
                                        onChange={() => setCategoria(cat)}
                                        className="h-4 w-4 bg-white/10 border-white/30 focus:ring-white/60 transition"
                                        required
                                        />
                                        <span className="text-sm capitalize">{cat}</span>
                                    </label>
                                ))}
                            </div> :
                            (course.categoria.nombre)
                        }
                    </div>
                    <div className="flex flex-row justify-start gap-1 text-base">
                        <strong>Precio: $</strong>
                        {(editable) ?
                            <input
                                id="precio"
                                name="precio"
                                type="number"
                                placeholder="Precio del plato"
                                value={precio}
                                onChange={(e) => setPrecio(Number(e.target.value))}
                                required
                            /> :
                            (course.precio)
                        }
                    </div>
                    {selectionable && (
                        <button className="justify-center mt-4" onClick={addItem}>
                            <HiOutlinePlus />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}