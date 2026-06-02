package com.uns.sistemarestaurantebackend.model;

import jakarta.persistence.*;
import lombok.*;

// Agrupa platos por tipo: entradas, principales, postres, bebidas (HU-04, HU-13)
@Entity
@Table(name = "categoria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categoria")
    private Integer idCategoria;

    @Column(nullable = false, length = 15)
    private String nombre;
}
