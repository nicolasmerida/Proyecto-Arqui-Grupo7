package com.uns.sistemarestaurantebackend.dto;

import com.uns.sistemarestaurantebackend.model.enums.EstadoItem;

public class ItemPedidoDTO {
    private Integer numeroComanda;
    private Integer idPlato;
    private Integer cantidad;
    private String notas;
    private EstadoItem estadoItem;

    public ItemPedidoDTO(Integer numeroComanda, Integer idPlato, Integer cantidad,
                         String notas, EstadoItem estadoItem) {
        this.numeroComanda = numeroComanda;
        this.idPlato = idPlato;
        this.cantidad = cantidad;
        this.notas = notas;
        this.estadoItem = estadoItem;
    }

    public Integer getNumeroComanda() { return numeroComanda; }
    public Integer getIdPlato() { return idPlato; }
    public Integer getCantidad() { return cantidad; }
    public String getNotas() { return notas; }
    public EstadoItem getEstadoItem() { return estadoItem; }
}