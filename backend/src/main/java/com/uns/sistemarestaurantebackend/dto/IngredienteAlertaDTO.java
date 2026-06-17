package com.uns.sistemarestaurantebackend.dto;

public class IngredienteAlertaDTO {
    private Integer idIngrediente;
    private String nombre;
    private Integer stockActual;
    private Integer stockMinimo;

    public IngredienteAlertaDTO(Integer idIngrediente, String nombre, Integer stockActual, Integer stockMinimo) {
        this.idIngrediente = idIngrediente;
        this.nombre = nombre;
        this.stockActual = stockActual;
        this.stockMinimo = stockMinimo;
    }

    public Integer getIdIngrediente() { return idIngrediente; }
    public String getNombre() { return nombre; }
    public Integer getStockActual() { return stockActual; }
    public Integer getStockMinimo() { return stockMinimo; }
}
