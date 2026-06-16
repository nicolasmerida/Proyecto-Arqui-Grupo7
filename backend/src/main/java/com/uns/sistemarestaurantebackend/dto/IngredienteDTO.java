package com.uns.sistemarestaurantebackend.dto;

public class IngredienteDTO {
    private Integer idIngrediente;
    private String nombre;
    private Integer stock;
    private Integer stockMinimo;
    private String unidad;

    public IngredienteDTO(Integer idIngrediente, String nombre, Integer stock,
                          Integer stockMinimo, String unidad) {
        this.idIngrediente = idIngrediente;
        this.nombre = nombre;
        this.stock = stock;
        this.stockMinimo = stockMinimo;
        this.unidad = unidad;
    }

    public Integer getIdIngrediente() { return idIngrediente; }
    public String getNombre() { return nombre; }
    public Integer getStock() { return stock; }
    public Integer getStockMinimo() { return stockMinimo; }
    public String getUnidad() { return unidad; }
}