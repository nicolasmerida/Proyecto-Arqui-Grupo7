package com.uns.sistemarestaurantebackend.repository;

import com.uns.sistemarestaurantebackend.model.Mesa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MesaRepository extends JpaRepository<Mesa, Integer> {
    List<Mesa> findByEstadoMesa(String estadoMesa);
}