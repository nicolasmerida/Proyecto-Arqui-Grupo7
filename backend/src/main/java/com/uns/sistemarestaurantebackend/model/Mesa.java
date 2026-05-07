package com.uns.sistemarestaurantebackend.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "mesa")
public class Mesa {

    @Id
    @Column(name = "numero_mesa")
    private Integer numeroMesa;

    @Column(nullable = false)
    private Integer capacidad;

    @Column(length = 15)
    private String sector;

    @Column(name = "estado_mesa", nullable = false, length = 15)
    private String estadoMesa;

    @Column(name = "hora_de_apertura")
    private LocalDateTime horaApertura;

    public Integer getNumeroMesa() { return numeroMesa; }
    public void setNumeroMesa(Integer numeroMesa) { this.numeroMesa = numeroMesa; }

    public Integer getCapacidad() { return capacidad; }
    public void setCapacidad(Integer capacidad) { this.capacidad = capacidad; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public String getEstadoMesa() { return estadoMesa; }
    public void setEstadoMesa(String estadoMesa) { this.estadoMesa = estadoMesa; }

    public LocalDateTime getHoraApertura() { return horaApertura; }
    public void setHorarioApertura(LocalDateTime horarioApertura) { this.horaApertura = horarioApertura; } 


}
