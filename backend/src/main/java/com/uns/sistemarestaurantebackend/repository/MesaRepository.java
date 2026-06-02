package com.uns.sistemarestaurantebackend.repository;

import com.uns.sistemarestaurantebackend.model.Mesa;
import com.uns.sistemarestaurantebackend.model.enums.EstadoMesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MesaRepository extends JpaRepository<Mesa, Integer> {

    // HU-01: filtrar mesas por estado para el mapa del salon
    List<Mesa> findByEstadoMesa(EstadoMesa estadoMesa);

    // HU-01: mesas de un sector especifico
    List<Mesa> findBySector(String sector);
}
