package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.model.MovStock;
import com.uns.sistemarestaurantebackend.service.MovStockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/movimientos-stock")
public class MovimientoStockController {

    @Autowired
    private MovStockService movStockService;

    @GetMapping("/ingrediente/{idIngrediente}")
    public List<MovStock> obtenerPorIngrediente(@PathVariable Integer idIngrediente) {
        return movStockService.obtenerPorIngrediente(idIngrediente);
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<MovStock> obtenerPorUsuario(@PathVariable Integer idUsuario) {
        return movStockService.obtenerPorUsuario(idUsuario);
    }

    @PostMapping
    public ResponseEntity<MovStock> registrar(@RequestBody MovStock movimiento) {
        return ResponseEntity.ok(movStockService.registrar(movimiento));
    }
}