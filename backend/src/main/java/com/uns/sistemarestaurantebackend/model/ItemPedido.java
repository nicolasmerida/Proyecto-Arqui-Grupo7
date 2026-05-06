package com.uns.sistemarestaurantebackend.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "item_pedido")
public class ItemPedido {

    @EmbeddedId
    private ItemPedidoId id;

    @ManyToOne
    @MapsId("numeroComanda")
    @JoinColumn(name = "numero_comanda")
    private Comanda comanda;

    @ManyToOne
    @MapsId("idPlato")
    @JoinColumn(name = "id_plato")
    private Plato plato;

    @Column(nullable = false)
    private Integer cantidad;

    @Column
    private String notas;

    @Column(name = "estado_item", length = 15)
    private String estadoItem;

    public ItemPedidoId getId() { return id; }
    public void setId(ItemPedidoId id) { this.id = id; }

    public Comanda getComanda() { return comanda; }
    public void setComanda(Comanda comanda) { this.comanda = comanda; }

    public Plato getPlato() { return plato; }
    public void setPlato(Plato plato) { this.plato = plato; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }

    public String getEstadoItem() { return estadoItem; }
    public void setEstadoItem(String estadoItem) { this.estadoItem = estadoItem; }

    @Embeddable
    public static class ItemPedidoId implements Serializable {
        private Integer numeroComanda;
        private Integer idPlato;

        public Integer getNumeroComanda() { return numeroComanda; }
        public void setNumeroComanda(Integer numeroComanda) { this.numeroComanda = numeroComanda; }

        public Integer getIdPlato() { return idPlato; }
        public void setIdPlato(Integer idPlato) { this.idPlato = idPlato; }
    }
}
