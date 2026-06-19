package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.dto.ComandaResumenDTO;
import com.uns.sistemarestaurantebackend.dto.mapper.ComandaMapper;
import com.uns.sistemarestaurantebackend.model.Comanda;
import com.uns.sistemarestaurantebackend.model.Usuario;
import com.uns.sistemarestaurantebackend.model.enums.EstadoComanda;
import com.uns.sistemarestaurantebackend.service.ComandaService;
import com.uns.sistemarestaurantebackend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class MetricaController {

    @Autowired
    private ComandaService comandaService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ComandaMapper comandaMapper;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        List<Comanda> todasComandas = comandaService.obtenerTodas();
        
        // 1. Obtener comandas cerradas
        List<Comanda> comandasCerradas = todasComandas.stream()
            .filter(c -> c.getEstadoComanda() == EstadoComanda.CERRADA)
            .collect(Collectors.toList());

        // 2. Calcular total de ventas
        BigDecimal sales = BigDecimal.ZERO;
        for (Comanda c : comandasCerradas) {
            BigDecimal totalComanda = comandaService.calcularTotal(c.getNumeroComanda());
            if (totalComanda != null) {
                sales = sales.add(totalComanda);
            }
        }

        // 3. Calcular ticket promedio
        BigDecimal ticket = BigDecimal.ZERO;
        if (!comandasCerradas.isEmpty()) {
            ticket = sales.divide(new BigDecimal(comandasCerradas.size()), 2, RoundingMode.HALF_UP);
        }

        // 4. Mapear todas las comandas a DTO (para el contador del frontend)
        List<ComandaResumenDTO> commands = todasComandas.stream()
            .map(comandaMapper::toResumenDTO)
            .collect(Collectors.toList());

        // 5. Obtener staff
        List<Usuario> staff = usuarioService.obtenerTodos();

        // Construir la respuesta usando un Map en lugar de un DTO
        Map<String, Object> stats = new HashMap<>();
        stats.put("sales", sales);
        stats.put("commands", commands);
        stats.put("ticket", ticket);
        stats.put("staff", staff);

        return ResponseEntity.ok(stats);
    }
}
