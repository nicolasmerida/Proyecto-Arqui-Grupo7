package com.uns.sistemarestaurantebackend.repository;

import com.uns.sistemarestaurantebackend.model.Categoria;
import com.uns.sistemarestaurantebackend.model.Plato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlatoRepository extends JpaRepository<Plato, Integer> {

    // HU-04: mozo navega el menu; solo muestra platos activos
    List<Plato> findByActivoTrue();

    // HU-04: navegar el menu por categoria (solo activos)
    List<Plato> findByCategoriaAndActivoTrue(Categoria categoria);

    // HU-13: admin puede ver todos incluyendo desactivados
    List<Plato> findByCategoria(Categoria categoria);
}
