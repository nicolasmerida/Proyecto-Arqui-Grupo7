package com.uns.sistemarestaurantebackend.repository;

import com.uns.sistemarestaurantebackend.model.Plato;
import com.uns.sistemarestaurantebackend.model.Receta;
import com.uns.sistemarestaurantebackend.model.Receta.RecetaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecetaRepository extends JpaRepository<Receta, RecetaId> {

    // HU-11: al agregar un item -> obtener ingredientes del plato para descontar stock
    // HU-14: al cancelar un item -> obtener ingredientes para devolver stock
    List<Receta> findByPlato(Plato plato);

    // Buscar receta por id de plato sin necesitar el objeto Plato
    List<Receta> findByPlatoIdPlato(Integer idPlato);
}
