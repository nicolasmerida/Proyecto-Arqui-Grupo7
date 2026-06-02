package com.uns.sistemarestaurantebackend.repository;

import com.uns.sistemarestaurantebackend.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {

    // Validar nombre unico al crear categoria
    Optional<Categoria> findByNombre(String nombre);

    boolean existsByNombre(String nombre);
}
