package com.uns.sistemarestaurantebackend.dto;

public class MesaEstadoInputDTO {
    private String estadoMesa;
    private Integer numeroComensales;

    public MesaEstadoInputDTO() {}

    public MesaEstadoInputDTO(String estadoMesa, Integer numeroComensales) {
        this.estadoMesa = estadoMesa;
        this.numeroComensales = numeroComensales;
    }

    public String getEstadoMesa() {
        return estadoMesa;
    }

    public void setEstadoMesa(String estadoMesa) {
        this.estadoMesa = estadoMesa;
    }

    public Integer getNumeroComensales() {
        return numeroComensales;
    }

    public void setNumeroComensales(Integer numeroComensales) {
        this.numeroComensales = numeroComensales;
    }
}
