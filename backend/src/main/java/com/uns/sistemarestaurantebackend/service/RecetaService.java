package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.exception.RecursoNoEncontradoException;
import com.uns.sistemarestaurantebackend.model.Receta;
import com.uns.sistemarestaurantebackend.repository.RecetaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecetaService {

    private final RecetaRepository recetaRepository;

    // Inyección por constructor
    public RecetaService(RecetaRepository recetaRepository) {
        this.recetaRepository = recetaRepository;
    }

    public List<Receta> obtenerPorPlato(Integer idPlato) {
        return recetaRepository.findByPlatoIdPlato(idPlato);
    }

    public Receta guardar(Receta receta) {
        // Inicializar el ID compuesto automáticamente para evitar que Jackson/Hibernate fallen
        if (receta.getId() == null && receta.getPlato() != null && receta.getIngrediente() != null) {
            receta.setId(new Receta.RecetaId(
                    receta.getPlato().getIdPlato(),
                    receta.getIngrediente().getIdIngrediente()
            ));
        }
        return recetaRepository.save(receta);
    }

    public void eliminar(Receta.RecetaId id) {
        // Validamos la existencia de la clave compuesta antes de borrar
        if (!recetaRepository.existsById(id)) {
            throw new RecursoNoEncontradoException(
                    "RECETA_NO_ENCONTRADA",
                    "No se puede eliminar la receta porque no existe en el sistema."
            );
        }
        recetaRepository.deleteById(id);
    }
}