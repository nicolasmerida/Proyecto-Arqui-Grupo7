package com.uns.sistemarestaurantebackend.repository;

import com.uns.sistemarestaurantebackend.model.ItemPedido;
import com.uns.sistemarestaurantebackend.model.ItemPedido.ItemPedidoId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemPedidoRepository extends JpaRepository<ItemPedido, ItemPedidoId> {
    List<ItemPedido> findByComandaNumeroComanda(Integer numeroComanda);
    List<ItemPedido> findByEstadoItem(String estadoItem);
}