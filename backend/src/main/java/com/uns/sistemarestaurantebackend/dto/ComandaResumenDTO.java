package com.uns.sistemarestaurantebackend.dto;

import com.uns.sistemarestaurantebackend.model.enums.EstadoComanda;
import java.time.LocalDateTime;

public class ComandaResumenDTO {
    private Integer numeroComanda;
    private EstadoComanda estadoComanda;
    private LocalDateTime fecha;
    private MesaDTO mesa;
    private Integer comensales;

    public ComandaResumenDTO(Integer numeroComanda, EstadoComanda estadoComanda, LocalDateTime fecha, MesaDTO mesa, Integer comensales) {
        this.numeroComanda = numeroComanda;
        this.estadoComanda = estadoComanda;
        this.fecha = fecha;
        this.mesa = mesa;
        this.comensales = comensales;
    }

    public Integer getNumeroComanda() { return numeroComanda; }
    public EstadoComanda getEstadoComanda() { return estadoComanda; }
    public LocalDateTime getFecha() { return fecha; }
    public MesaDTO getMesa() { return mesa; }
    public Integer getComensales() { return comensales; }
}
