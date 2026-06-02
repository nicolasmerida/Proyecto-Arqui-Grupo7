package com.uns.sistemarestaurantebackend.repository;

import com.uns.sistemarestaurantebackend.model.Comanda;
import com.uns.sistemarestaurantebackend.model.Mesa;
import com.uns.sistemarestaurantebackend.model.enums.EstadoComanda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComandaRepository extends JpaRepository<Comanda, Integer> {

    // HU-02: buscar comanda activa de una mesa (evitar abrir dos comandas a la vez)
    Optional<Comanda> findByMesaAndEstadoComandaNot(Mesa mesa, EstadoComanda estado);

    // Historial de todas las comandas de una mesa
    List<Comanda> findByMesa(Mesa mesa);

    // HU-15: metricas — comandas cerradas para calcular total facturado del dia
    List<Comanda> findByEstadoComanda(EstadoComanda estado);

    // Buscar comanda activa de una mesa por numero (sin necesitar el objeto Mesa)
    Optional<Comanda> findByMesaNumeroMesa(Integer numeroMesa);
}
