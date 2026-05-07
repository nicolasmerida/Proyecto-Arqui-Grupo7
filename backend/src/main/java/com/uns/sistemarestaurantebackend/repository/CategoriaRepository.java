package com.uns.sistemarestaurantebackend.repository;

import com.uns.sistemarestaurantebackend.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
}