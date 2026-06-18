package com.uns.sistemarestaurantebackend.dto;

import com.uns.sistemarestaurantebackend.model.enums.EstadoComanda;
import java.time.LocalDateTime;
import java.util.List;

public class ComandaDetalleDTO {
    private Integer numeroComanda;
    private EstadoComanda estadoComanda;
    private LocalDateTime fecha;
    private MesaDTO mesa;
    private Integer comensales;
    private List<ItemPedidoDTO> items;

    public ComandaDetalleDTO(Integer numeroComanda, EstadoComanda estadoComanda, LocalDateTime fecha, MesaDTO mesa, Integer comensales, List<ItemPedidoDTO> items) {
        this.numeroComanda = numeroComanda;
        this.estadoComanda = estadoComanda;
        this.fecha = fecha;
        this.mesa = mesa;
        this.comensales = comensales;
        this.items = items;
    }

    public Integer getNumeroComanda() { return numeroComanda; }
    public EstadoComanda getEstadoComanda() { return estadoComanda; }
    public LocalDateTime getFecha() { return fecha; }
    public MesaDTO getMesa() { return mesa; }
    public Integer getComensales() { return comensales; }
    public List<ItemPedidoDTO> getItems() { return items; }
}
