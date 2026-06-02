package com.uns.sistemarestaurantebackend.model;

import com.uns.sistemarestaurantebackend.model.enums.EstadoMesa;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// HU-01: ver estado del salon / HU-02: abrir mesa / HU-03: cerrar mesa
@Entity
@Table(name = "mesa")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "numero_mesa")
    private Integer numeroMesa;

    @Column(nullable = false)
    private Integer capacidad;

    @Column(nullable = false, length = 15)
    private String sector;

    @Column(name = "estado_mesa", nullable = false, length = 15)
    private EstadoMesa estadoMesa;

    @Column(name = "hora_de_apertura")
    private LocalDateTime horaDeApertura;
}
