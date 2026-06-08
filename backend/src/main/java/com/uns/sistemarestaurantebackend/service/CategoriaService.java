package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.exception.RecursoNoEncontradoException;
import com.uns.sistemarestaurantebackend.model.Categoria;
import com.uns.sistemarestaurantebackend.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    // 1. Inyección por Constructor: Chau @Autowired, hola 'final'.
    // Esto es estándar de la industria y hace el código mucho más seguro.
    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<Categoria> obtenerTodas() {
        return categoriaRepository.findAll();
    }

    public Categoria obtenerPorId(Integer id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "CATEGORIA_NO_ENCONTRADA",
                        "La categoría con ID " + id + " no existe."
                ));
    }

    public Categoria guardar(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    public Categoria actualizar(Integer id, Categoria categoriaActualizada) {
        // 2. Solución a la variable sin usar:
        // Llamamos al método solo para que valide. Si no existe, lanza la excepción y frena todo.
        // Si existe, pasa de largo sin gastar memoria extra.
        obtenerPorId(id);

        categoriaActualizada.setIdCategoria(id);
        return categoriaRepository.save(categoriaActualizada);
    }

    public void eliminar(Integer id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RecursoNoEncontradoException(
                    "CATEGORIA_NO_ENCONTRADA",
                    "No se puede eliminar porque la categoría con ID " + id + " no existe."
            );
        }
        categoriaRepository.deleteById(id);
    }
}