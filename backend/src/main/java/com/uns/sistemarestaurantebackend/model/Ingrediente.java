package com.uns.sistemarestaurantebackend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

// HU-09: ver stock / HU-10: registrar ingreso / HU-11: descuento auto / HU-12: stock minimo
@Entity
@Table(name = "ingrediente")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ingrediente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ingrediente")
    private Integer idIngrediente;

    @Column(nullable = false, length = 25)
    private String nombre;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "stock_minimo", nullable = false)
    private Integer stockMinimo;

    // Unidad de medida: kg, g, l, ml, u (max 5 chars segun schema)
    @Column(nullable = false, length = 5)
    private String unidad;

    // Logica de dominio usada por HU-09 (alerta visual) y HU-12 (evaluar umbral)
    public boolean estaBajoMinimo() {
        return this.stock < this.stockMinimo;
    }
}
