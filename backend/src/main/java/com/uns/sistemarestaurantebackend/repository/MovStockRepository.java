package com.uns.sistemarestaurantebackend.repository;

import com.uns.sistemarestaurantebackend.model.MovStock;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MovStockRepository extends JpaRepository<MovStock, Integer> {
    List<MovStock> findByIngredienteIdIngrediente(Integer idIngrediente);
    List<MovStock> findByUsuarioId(Integer idUsuario);
}