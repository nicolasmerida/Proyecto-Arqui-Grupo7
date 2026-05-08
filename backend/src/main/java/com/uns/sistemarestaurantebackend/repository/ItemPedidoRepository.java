package com.uns.sistemarestaurantebackend.repository;

import com.uns.sistemarestaurantebackend.model.Comanda;
import com.uns.sistemarestaurantebackend.model.ItemPedido;
import com.uns.sistemarestaurantebackend.model.ItemPedido.ItemPedidoId;
import com.uns.sistemarestaurantebackend.model.enums.EstadoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemPedidoRepository extends JpaRepository<ItemPedido, ItemPedidoId> {

    // HU-06: pantalla de cocina — items Pendiente o En preparacion, ordenados por fecha
    List<ItemPedido> findByEstadoItemInOrderByComandaFechaAsc(List<EstadoItem> estados);

    // HU-03: detalle completo de comanda para generar la cuenta
    List<ItemPedido> findByComanda(Comanda comanda);

    // HU-07: verificar si todos los items de una comanda estan Listos (para notificar al mozo)
    List<ItemPedido> findByComandaAndEstadoItem(Comanda comanda, EstadoItem estado);

    // Buscar items por numero de comanda sin necesitar el objeto Comanda
    List<ItemPedido> findByComandaNumeroComanda(Integer numeroComanda);

    // Buscar items por estado
    List<ItemPedido> findByEstadoItem(EstadoItem estado);
}
