package com.uns.sistemarestaurantebackend.dto;

import com.uns.sistemarestaurantebackend.model.enums.EstadoMesa;
import java.time.LocalDateTime;

public class MesaDTO {
    private Integer numeroMesa;
    private Integer capacidad;
    private String sector;
    private EstadoMesa estadoMesa;
    private LocalDateTime horaDeApertura;

    public MesaDTO(Integer numeroMesa, Integer capacidad, String sector,
                   EstadoMesa estadoMesa, LocalDateTime horaDeApertura) {
        this.numeroMesa = numeroMesa;
        this.capacidad = capacidad;
        this.sector = sector;
        this.estadoMesa = estadoMesa;
        this.horaDeApertura = horaDeApertura;
    }

    public Integer getNumeroMesa() { return numeroMesa; }
    public Integer getCapacidad() { return capacidad; }
    public String getSector() { return sector; }
    public EstadoMesa getEstadoMesa() { return estadoMesa; }
    public LocalDateTime getHoraDeApertura() { return horaDeApertura; }
}