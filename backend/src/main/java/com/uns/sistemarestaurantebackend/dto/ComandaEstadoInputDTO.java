package com.uns.sistemarestaurantebackend.dto;

public class ComandaEstadoInputDTO {
    private String nuevoEstado;

    public ComandaEstadoInputDTO() {}

    public ComandaEstadoInputDTO(String nuevoEstado) {
        this.nuevoEstado = nuevoEstado;
    }

    public String getNuevoEstado() {
        return nuevoEstado;
    }

    public void setNuevoEstado(String nuevoEstado) {
        this.nuevoEstado = nuevoEstado;
    }
}
