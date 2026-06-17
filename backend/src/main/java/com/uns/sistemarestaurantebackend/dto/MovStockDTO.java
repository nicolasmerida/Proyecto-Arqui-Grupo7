package com.uns.sistemarestaurantebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovStockDTO {
    private Integer idMov;
    private String nombreIngrediente;
    private String unidadIngrediente;
    private String nombreUsuario;
    private Integer cantidad;
    private LocalDateTime fecha;
}
