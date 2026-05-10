package com.uns.sistemarestaurantebackend.repository;

import com.uns.sistemarestaurantebackend.model.Ingrediente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;

import java.util.List;
import java.util.Optional;

@Repository
public interface IngredienteRepository extends JpaRepository<Ingrediente, Integer> {

    // HU-09: buscar ingrediente por nombre (busqueda parcial, case-insensitive)
    List<Ingrediente> findByNombreContainingIgnoreCase(String nombre);

    // HU-09: destacar ingredientes bajo minimo (alerta visual)
    // HU-12: el sistema evalua el umbral cada vez que se modifica el stock
    @Query("SELECT i FROM Ingrediente i WHERE i.stock < i.stockMinimo")
    List<Ingrediente> findIngredientesBajoMinimo();

    // HU-11: Bloqueo Pesimista: evita que dos transacciones modifiquen el stock al
    // mismo tiempo
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM Ingrediente i WHERE i.idIngrediente = :id")
    Optional<Ingrediente> findByIdForUpdate(@Param("id") Integer id);
}
