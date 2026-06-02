package com.uns.sistemarestaurantebackend.repository;

import com.uns.sistemarestaurantebackend.model.Ingrediente;
import com.uns.sistemarestaurantebackend.model.MovStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MovStockRepository extends JpaRepository<MovStock, Integer> {

    // HU-17: historial de un ingrediente ordenado del mas reciente al mas antiguo
    List<MovStock> findByIngredienteOrderByFechaDesc(Ingrediente ingrediente);

    // HU-17: filtrar historial por rango de fechas
    List<MovStock> findByIngredienteAndFechaBetweenOrderByFechaDesc(
            Ingrediente ingrediente, LocalDateTime desde, LocalDateTime hasta);

    // Buscar movimientos por id de ingrediente sin necesitar el objeto Ingrediente
    List<MovStock> findByIngredienteIdIngrediente(Integer idIngrediente);

    // Buscar movimientos por id de usuario
    List<MovStock> findByUsuarioIdUsuario(Integer idUsuario);
}
