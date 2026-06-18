package com.uns.sistemarestaurantebackend.dto.mapper;

import com.uns.sistemarestaurantebackend.dto.ComandaResumenDTO;
import com.uns.sistemarestaurantebackend.dto.ComandaDetalleDTO;
import com.uns.sistemarestaurantebackend.model.Comanda;
import org.springframework.stereotype.Component;

@Component
public class ComandaMapper {

    private final MesaMapper mesaMapper;
    private final ItemPedidoMapper itemPedidoMapper;

    public ComandaMapper(MesaMapper mesaMapper, ItemPedidoMapper itemPedidoMapper) {
        this.mesaMapper = mesaMapper;
        this.itemPedidoMapper = itemPedidoMapper;
    }

    public ComandaResumenDTO toResumenDTO(Comanda comanda) {
        return new ComandaResumenDTO(
                comanda.getNumeroComanda(),
                comanda.getEstadoComanda(),
                comanda.getFecha(),
                mesaMapper.toDTO(comanda.getMesa()),
                comanda.getComensales()
        );
    }

    public ComandaDetalleDTO toDetalleDTO(Comanda comanda, java.util.List<com.uns.sistemarestaurantebackend.model.ItemPedido> items) {
        return new ComandaDetalleDTO(
                comanda.getNumeroComanda(),
                comanda.getEstadoComanda(),
                comanda.getFecha(),
                mesaMapper.toDTO(comanda.getMesa()),
                comanda.getComensales(),
                itemPedidoMapper.toDTOList(items)
        );
    }
}
