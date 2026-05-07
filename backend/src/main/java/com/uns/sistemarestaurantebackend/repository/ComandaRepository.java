package com.uns.sistemarestaurantebackend.repository;

import com.uns.sistemarestaurantebackend.model.Comanda;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ComandaRepository extends JpaRepository<Comanda, Integer> {
    List<Comanda> findByEstadoComanda(String estadoComanda);
    Optional<Comanda> findByMesaNumeroMesa(Integer numeroMesa);
}