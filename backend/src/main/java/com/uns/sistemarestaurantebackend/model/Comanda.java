package com.uns.sistemarestaurantebackend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.uns.sistemarestaurantebackend.model.enums.EstadoComanda;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// HU-02: abrir comanda / HU-03: cerrar / HU-04 y 05: agregar items
// Maquina de estados: Abierta -> (Cancelada) -> En preparacion -> Lista -> Entregada -> Cerrada
@Entity
@Table(name = "comanda")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comanda {

    // CORRECCION: faltaba @GeneratedValue — sin esto los inserts fallaban
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "numero_comanda")
    private Integer numeroComanda;

    // La DB tiene DEFAULT NOW() pero Hibernate inserta null si no seteamos el valor desde Java
    // @Builder.Default asegura que el Builder lo inicialice aunque no se llame .fecha()
    @Builder.Default
    @Column
    private LocalDateTime fecha = LocalDateTime.now();

    // CORRECCION: era String -> ahora enum con Converter (autoApply)
    // Ademas faltaba nullable = false
    @Column(name = "estado_comanda", nullable = false, length = 15)
    private EstadoComanda estadoComanda;

    // CORRECCION: faltaba FetchType.LAZY — sin LAZY, cargar una comanda
    // automaticamente cargaba la Mesa completa, innecesario y lento (viola RNF-01)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "numero_mesa", nullable = false)
    private Mesa mesa;

    @Column(name = "comensales")
    private Integer comensales;

    // Relacion N:N a traves de mozo_comanda (HU-02: mozo asignado)
    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "mozo_comanda",
        joinColumns = @JoinColumn(name = "numero_comanda"),
        inverseJoinColumns = @JoinColumn(name = "id_usuario")
    )
    private List<Usuario> mozos = new ArrayList<>();
}
