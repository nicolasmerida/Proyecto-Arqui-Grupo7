package com.uns.sistemarestaurantebackend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

// HU-04: mozo navega menu / HU-13: admin gestiona platos
@Entity
@Table(name = "plato")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Plato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_plato")
    private Integer idPlato;

    @Column(nullable = false, length = 25)
    private String nombre;

    // BigDecimal para dinero: evita errores de precision flotante en calculos de totales
    @Column(nullable = false, precision = 7, scale = 2)
    private BigDecimal precio;

    // CORRECCION: faltaba nullable = false (la DB tiene NOT NULL)
    @Column(nullable = false, length = 100)
    private String descripcion;

    // HU-13: se puede desactivar sin eliminar
    // @Builder.Default: cuando se usa el Builder sin llamar .activo(), vale true por defecto
    // Sin @Builder.Default Lombok ignoraria el "= true" y el campo quedaria null
    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;
}
