package com.uns.sistemarestaurantebackend.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "receta")
public class Receta {

    @EmbeddedId
    private RecetaId id;

    @ManyToOne
    @MapsId("idPlato")
    @JoinColumn(name = "id_plato")
    private Plato plato;

    @ManyToOne
    @MapsId("idIngrediente")
    @JoinColumn(name = "id_ingrediente")
    private Ingrediente ingrediente;

    @Column(nullable = false)
    private Integer cantidad;

    // Getters y Setters
    public RecetaId getId() { return id; }
    public void setId(RecetaId id) { this.id = id; }

    public Plato getPlato() { return plato; }
    public void setPlato(Plato plato) { this.plato = plato; }

    public Ingrediente getIngrediente() { return ingrediente; }
    public void setIngrediente(Ingrediente ingrediente) { this.ingrediente = ingrediente; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    // Clave compuesta
    @Embeddable
    public static class RecetaId implements Serializable {
        private Integer idPlato;
        private Integer idIngrediente;

        public Integer getIdPlato() { return idPlato; }
        public void setIdPlato(Integer idPlato) { this.idPlato = idPlato; }

        public Integer getIdIngrediente() { return idIngrediente; }
        public void setIdIngrediente(Integer idIngrediente) { this.idIngrediente = idIngrediente; }
    }
}