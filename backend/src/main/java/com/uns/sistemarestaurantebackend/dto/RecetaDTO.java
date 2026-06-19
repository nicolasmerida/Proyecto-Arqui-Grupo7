package com.uns.sistemarestaurantebackend.dto;

public class RecetaDTO {
    private Integer idPlato;
    private IngredienteDTO ingrediente;
    private Integer cantidad;

    public RecetaDTO() {}

    public RecetaDTO(Integer idPlato, IngredienteDTO ingrediente, Integer cantidad) {
        this.idPlato = idPlato;
        this.ingrediente = ingrediente;
        this.cantidad = cantidad;
    }

    public Integer getIdPlato() { return idPlato; }
    public void setIdPlato(Integer idPlato) { this.idPlato = idPlato; }

    public IngredienteDTO getIngrediente() { return ingrediente; }
    public void setIngrediente(IngredienteDTO ingrediente) { this.ingrediente = ingrediente; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}
