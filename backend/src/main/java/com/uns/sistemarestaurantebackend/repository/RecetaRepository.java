package com.uns.sistemarestaurantebackend.repository;

import com.uns.sistemarestaurantebackend.model.Receta;
import com.uns.sistemarestaurantebackend.model.Receta.RecetaId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecetaRepository extends JpaRepository<Receta, RecetaId> {
    List<Receta> findByPlatoIdPlato(Integer idPlato);
}