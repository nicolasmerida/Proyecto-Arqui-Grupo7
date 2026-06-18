package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.dto.AdminStatsDTO;
import com.uns.sistemarestaurantebackend.dto.ComandaResumenDTO;
import com.uns.sistemarestaurantebackend.dto.mapper.ComandaMapper;
import com.uns.sistemarestaurantebackend.model.Comanda;
import com.uns.sistemarestaurantebackend.model.Usuario;
import com.uns.sistemarestaurantebackend.service.ComandaService;
import com.uns.sistemarestaurantebackend.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final ComandaService comandaService;
    private final UsuarioService usuarioService;
    private final ComandaMapper comandaMapper;

    public AdminController(ComandaService comandaService, UsuarioService usuarioService, ComandaMapper comandaMapper) {
        this.comandaService = comandaService;
        this.usuarioService = usuarioService;
        this.comandaMapper = comandaMapper;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getStats() {
        List<Comanda> todasLasComandas = comandaService.obtenerTodas();
        
        // Convertimos a DTO para enviar al frontend
        List<ComandaResumenDTO> comandasDto = todasLasComandas.stream()
                .map(comandaMapper::toResumenDTO)
                .collect(Collectors.toList());

        // Calcular ventas totales (sales) sumando el total de cada comanda
        BigDecimal totalSales = BigDecimal.ZERO;
        for (Comanda c : todasLasComandas) {
            BigDecimal totalComanda = comandaService.calcularTotal(c.getNumeroComanda());
            totalSales = totalSales.add(totalComanda);
        }

        // Calcular ticket promedio
        BigDecimal ticketPromedio = BigDecimal.ZERO;
        if (!todasLasComandas.isEmpty()) {
            ticketPromedio = totalSales.divide(new BigDecimal(todasLasComandas.size()), 2, RoundingMode.HALF_UP);
        }

        // Obtener staff
        List<Usuario> staff = usuarioService.obtenerTodos();

        AdminStatsDTO stats = AdminStatsDTO.builder()
                .sales(totalSales)
                .commands(comandasDto)
                .ticket(ticketPromedio)
                .staff(staff)
                .build();

        return ResponseEntity.ok(stats);
    }
}
