package com.uns.sistemarestaurantebackend.dto;

public class ComandaDTO {
    private Integer numeroComanda;
    private String  estado;


    public ComandaDTO(Integer numeroComanda, String estado){
        this.numeroComanda = numeroComanda;
        this.estado = estado;
    }

    public Integer getNumeroComanda() { return numeroComanda; }
    public String getEstado() { return estado; }
}

