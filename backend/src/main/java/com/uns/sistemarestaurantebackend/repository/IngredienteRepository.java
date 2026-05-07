package com.uns.sistemarestaurantebackend.repository;

import com.uns.sistemarestaurantebackend.model.Ingrediente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IngredienteRepository extends JpaRepository<Ingrediente, Integer> {
    List<Ingrediente> findByStockLessThanEqual(Integer stockMinimo);
}