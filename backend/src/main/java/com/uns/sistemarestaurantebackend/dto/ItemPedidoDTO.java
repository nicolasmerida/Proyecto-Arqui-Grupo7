package com.uns.sistemarestaurantebackend.dto;

import com.uns.sistemarestaurantebackend.model.enums.EstadoItem;
import java.math.BigDecimal;

public class ItemPedidoDTO {
    private Integer numeroComanda;
    private Integer idPlato;
    private String nombrePlato;
    private Integer cantidad;
    private String notas;
    private EstadoItem estadoItem;
    private BigDecimal precio;

    public ItemPedidoDTO(Integer numeroComanda, Integer idPlato, String nombrePlato, Integer cantidad,
                         String notas, EstadoItem estadoItem, BigDecimal precio) {
        this.numeroComanda = numeroComanda;
        this.idPlato = idPlato;
        this.nombrePlato = nombrePlato;
        this.cantidad = cantidad;
        this.notas = notas;
        this.estadoItem = estadoItem;
        this.precio = precio;
    }

    public Integer getNumeroComanda() { return numeroComanda; }
    public Integer getIdPlato() { return idPlato; }
    public String getNombrePlato() { return nombrePlato; }
    public Integer getCantidad() { return cantidad; }
    public String getNotas() { return notas; }
    public EstadoItem getEstadoItem() { return estadoItem; }
    public BigDecimal getPrecio() { return precio; }
}