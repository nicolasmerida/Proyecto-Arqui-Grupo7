package com.uns.sistemarestaurantebackend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.uns.sistemarestaurantebackend.model.enums.EstadoItem;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

// HU-04: agregar items / HU-06: cocina ve items pendientes / HU-07: actualizar estado
// Clave primaria compuesta: (id_plato, numero_comanda)
@Entity
@Table(name = "item_pedido")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemPedido {

    @EmbeddedId
    private ItemPedidoId id;

    // CORRECCION: faltaba FetchType.LAZY en ambos @ManyToOne
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("numeroComanda")
    @JoinColumn(name = "numero_comanda")
    private Comanda comanda;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idPlato")
    @JoinColumn(name = "id_plato")
    private Plato plato;

    @Column(nullable = false)
    private Integer cantidad;

    // Notas opcionales: "sin cebolla", "punto medio" — TEXT en DB = sin limite de largo
    @Column(columnDefinition = "TEXT")
    private String notas;

    // CORRECCION: era String -> ahora enum con Converter
    // nullable=false faltaba tambien
    @Column(name = "estado_item", nullable = false, length = 15)
    private EstadoItem estadoItem;

    // CORRECCION CRITICA: faltaban equals() y hashCode()
    // JPA los necesita para comparar IDs compuestos en findById() y caches de primer nivel
    // Sin ellos, dos ItemPedidoId iguales se tratan como distintos -> queries incorrectos
    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class ItemPedidoId implements Serializable {

        @Column(name = "numero_comanda")
        private Integer numeroComanda;

        @Column(name = "id_plato")
        private Integer idPlato;
    }
}
