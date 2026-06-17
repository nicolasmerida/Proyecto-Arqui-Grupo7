package com.uns.sistemarestaurantebackend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

// Tabla pivote Plato <-> Ingrediente con cantidad requerida
// Usada en HU-11 (descontar stock al crear item) y HU-14 (devolver al cancelar)
@Entity
@Table(name = "receta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Receta {

    @EmbeddedId
    private RecetaId id;

    // CORRECCION: faltaba FetchType.LAZY en ambos @ManyToOne
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idPlato")
    @JoinColumn(name = "id_plato")
    private Plato plato;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idIngrediente")
    @JoinColumn(name = "id_ingrediente")
    private Ingrediente ingrediente;

    // Cantidad del ingrediente necesaria para preparar una unidad del plato
    @Column(nullable = false)
    private Integer cantidad;

    // CORRECCION CRITICA: faltaban equals() y hashCode()
    // @EqualsAndHashCode de Lombok los genera automaticamente sobre todos los campos
    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    public static class RecetaId implements Serializable {

        @Column(name = "id_plato")
        private Integer idPlato;

        @Column(name = "id_ingrediente")
        private Integer idIngrediente;
    }
}
