package com.uns.sistemarestaurantebackend.repository;

import com.uns.sistemarestaurantebackend.model.Plato;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlatoRepository extends JpaRepository<Plato, Integer> {
    List<Plato> findByActivo(Boolean activo);
    List<Plato> findByCategoriaIdCategoria(Integer idCategoria);
}