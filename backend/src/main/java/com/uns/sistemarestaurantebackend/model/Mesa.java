package com.uns.sistemarestaurantebackend.model;

import com.uns.sistemarestaurantebackend.model.enums.EstadoMesa;
import jakarta.persistence.*;
import lombok.*;

// HU-01: ver estado del salon / HU-02: abrir mesa / HU-03: cerrar mesa
@Entity
@Table(name = "mesa")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mesa {

    // CORRECCION: @GeneratedValue faltaba — sin esto los inserts fallaban
    // porque PostgreSQL genera el ID con GENERATED ALWAYS AS IDENTITY
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "numero_mesa")
    private Integer numeroMesa;

    @Column(nullable = false)
    private Integer capacidad;

    // CORRECCION: nullable = false faltaba (la DB tiene NOT NULL)
    @Column(nullable = false, length = 15)
    private String sector;

    // CORRECCION: era String — ahora usa el enum con su Converter
    // El converter autoApply=true lo convierte automaticamente a/desde "Libre"/"Ocupada"/"Reservada"
    @Column(name = "estado_mesa", nullable = false, length = 15)
    private EstadoMesa estadoMesa;
}
