package com.uns.sistemarestaurantebackend.dto;

public class PlatoDTO {
    private Integer idPlato;
    private String nombre;
    private java.math.BigDecimal precio;
    private String descripcion;
    private String categoria;
    private Boolean activo;

    public PlatoDTO(Integer idPlato, String nombre, java.math.BigDecimal precio,
                     String descripcion, String categoria, Boolean activo) {
        this.idPlato = idPlato;
        this.nombre = nombre;
        this.precio = precio;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.activo = activo;
    }

    public Integer getIdPlato() { return idPlato; }
    public String getNombre() { return nombre; }
    public java.math.BigDecimal getPrecio() { return precio; }
    public String getDescripcion() { return descripcion; }
    public String getCategoria() { return categoria; }
    public Boolean getActivo() { return activo; }
}
