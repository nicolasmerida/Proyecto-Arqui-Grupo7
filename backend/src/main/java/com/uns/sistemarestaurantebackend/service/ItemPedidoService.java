package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.model.ItemPedido;
import com.uns.sistemarestaurantebackend.model.enums.EstadoItem;
import com.uns.sistemarestaurantebackend.repository.ItemPedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ItemPedidoService {

    @Autowired
    private ItemPedidoRepository itemPedidoRepository;

    public List<ItemPedido> obtenerPorComanda(Integer numeroComanda) {
        return itemPedidoRepository.findByComandaNumeroComanda(numeroComanda);
    }

    public List<ItemPedido> obtenerPorEstado(String estado) {
        return itemPedidoRepository.findByEstadoItem(EstadoItem.fromValor(estado));
    }

    public ItemPedido guardar(ItemPedido itemPedido) {
        return itemPedidoRepository.save(itemPedido);
    }

    public ItemPedido cambiarEstado(ItemPedido.ItemPedidoId id, String nuevoEstado) {
        // TODO: al marcar como LISTO descontar ingredientes del stock automaticamente
        // TODO: notificar al mozo via WebSocket
        ItemPedido item = itemPedidoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Item no encontrado"));
        item.setEstadoItem(EstadoItem.fromValor(nuevoEstado));
        return itemPedidoRepository.save(item);
    }

    public void eliminar(ItemPedido.ItemPedidoId id) {
        itemPedidoRepository.deleteById(id);
    }
}
