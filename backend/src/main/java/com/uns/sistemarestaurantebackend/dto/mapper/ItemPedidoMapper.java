package com.uns.sistemarestaurantebackend.dto.mapper;

import com.uns.sistemarestaurantebackend.dto.ItemPedidoDTO;
import com.uns.sistemarestaurantebackend.model.ItemPedido;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class ItemPedidoMapper {

    public ItemPedidoDTO toDTO(ItemPedido item) {
        return new ItemPedidoDTO(
                item.getId().getNumeroComanda(),
                item.getId().getIdPlato(),
                item.getPlato() != null ? item.getPlato().getNombre() : null,
                item.getCantidad(),
                item.getNotas(),
                item.getEstadoItem()
        );
    }

   public ItemPedido toEntity(ItemPedidoDTO dto) {
        ItemPedido item = new ItemPedido();
        ItemPedido.ItemPedidoId id = new ItemPedido.ItemPedidoId(dto.getNumeroComanda(), dto.getIdPlato());
        item.setId(id);
        item.setCantidad(dto.getCantidad());
        item.setNotas(dto.getNotas());
        item.setEstadoItem(dto.getEstadoItem());
        
        com.uns.sistemarestaurantebackend.model.Plato plato = new com.uns.sistemarestaurantebackend.model.Plato();
        plato.setIdPlato(dto.getIdPlato());
        item.setPlato(plato);
        
        com.uns.sistemarestaurantebackend.model.Comanda comanda = new com.uns.sistemarestaurantebackend.model.Comanda();
        comanda.setNumeroComanda(dto.getNumeroComanda());
        item.setComanda(comanda);

        return item;
    }

    public List<ItemPedidoDTO> toDTOList(List<ItemPedido> items) {
        return items.stream().map(this::toDTO).toList();
    }
}