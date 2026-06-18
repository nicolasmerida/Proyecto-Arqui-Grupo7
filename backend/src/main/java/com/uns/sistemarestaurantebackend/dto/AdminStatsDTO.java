package com.uns.sistemarestaurantebackend.dto;

import com.uns.sistemarestaurantebackend.model.Usuario;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class AdminStatsDTO {
    private BigDecimal sales;
    private List<ComandaResumenDTO> commands;
    private BigDecimal ticket;
    private List<Usuario> staff;
}
