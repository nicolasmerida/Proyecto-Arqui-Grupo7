package com.uns.sistemarestaurantebackend.repository;

import com.uns.sistemarestaurantebackend.model.Comanda;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComandaRepository extends JpaRepository<Comanda, Integer> {
    List<Comanda> findByEstadoComanda(String estadoComanda);
    List<Comanda> findByMesaNumeroMesa(Integer numeroMesa);
}