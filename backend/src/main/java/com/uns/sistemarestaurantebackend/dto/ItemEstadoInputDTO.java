package com.uns.sistemarestaurantebackend.dto;

public class ItemEstadoInputDTO {
    private String nuevoEstado;

    public ItemEstadoInputDTO() {}

    public ItemEstadoInputDTO(String nuevoEstado) {
        this.nuevoEstado = nuevoEstado;
    }

    public String getNuevoEstado() {
        return nuevoEstado;
    }

    public void setNuevoEstado(String nuevoEstado) {
        this.nuevoEstado = nuevoEstado;
    }
}
