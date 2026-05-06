package com.uns.sistemarestaurantebackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// Registro de cada cambio de stock
// Ingreso de mercaderia (HU-10), descuento automatico (HU-11), devolucion al cancelar (HU-14)
// HU-17: historial completo para auditoria
@Entity
@Table(name = "mov_stock")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mov")
    private Integer idMov;

    @Builder.Default
    @Column
    private LocalDateTime fecha = LocalDateTime.now();

    // Positivo = ingreso (HU-10), Negativo = consumo (HU-11), Positivo = devolucion (HU-14)
    @Column(nullable = false)
    private Integer cantidad;

    // CORRECCION: faltaba FetchType.LAZY y nullable=false
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ingrediente", nullable = false)
    private Ingrediente ingrediente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    // CORRECCION CRITICA: la version original tenia @JoinColumn(name = "id_plato")
    // pero mov_stock NO tiene columna id_plato en el schema SQL
    // Hibernate tiraba error de validacion al arrancar — campo eliminado
}
