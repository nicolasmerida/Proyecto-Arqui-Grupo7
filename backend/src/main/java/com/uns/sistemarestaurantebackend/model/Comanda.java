package com.uns.sistemarestaurantebackend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "comanda")
public class Comanda {

    @Id
    @Column(name = "numero_comanda")
    private Integer numeroComanda;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(name = "estado_comanda", length = 15)
    private String estadoComanda;

    @ManyToOne
    @JoinColumn(name = "numero_mesa")
    private Mesa mesa;

    @ManyToMany
    @JoinTable(
        name = "mozo_comanda",
        joinColumns = @JoinColumn(name = "numero_comanda"),
        inverseJoinColumns = @JoinColumn(name = "id_usuario")
    )
    private List<Usuario> mozos;

    public Integer getNumeroComanda() { return numeroComanda; }
    public void setNumeroComanda(Integer numeroComanda) { this.numeroComanda = numeroComanda; }

    public LocalDateTime getFecha() { return fecha; }
    public void setFecha(LocalDateTime fecha) { this.fecha = fecha; }

    public String getEstadoComanda() { return estadoComanda; }
    public void setEstadoComanda(String estadoComanda) { this.estadoComanda = estadoComanda; }

    public Mesa getMesa() { return mesa; }
    public void setMesa(Mesa mesa) { this.mesa = mesa; }

    public List<Usuario> getMozos() { return mozos; }
    public void setMozos(List<Usuario> mozos) { this.mozos = mozos; }
}
