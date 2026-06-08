package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.model.Ingrediente;
import com.uns.sistemarestaurantebackend.service.GestorStockFacade;
import com.uns.sistemarestaurantebackend.service.IngredienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ingredientes")
public class IngredienteController {

    // Inyección por constructor doble
    private final IngredienteService ingredienteService;
    private final GestorStockFacade gestorStockFacade;

    public IngredienteController(IngredienteService ingredienteService, GestorStockFacade gestorStockFacade) {
        this.ingredienteService = ingredienteService;
        this.gestorStockFacade = gestorStockFacade;
    }

    @GetMapping
    public ResponseEntity<List<Ingrediente>> obtenerTodos() {
        return ResponseEntity.ok(ingredienteService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ingrediente> obtenerPorId(@PathVariable Integer id) {
        // Super limpio: el Controller solo llama al Service
        return ResponseEntity.ok(ingredienteService.obtenerPorId(id));
    }

    @GetMapping("/bajo-stock")
    public ResponseEntity<List<Ingrediente>> obtenerBajoStock() {
        return ResponseEntity.ok(ingredienteService.obtenerBajoStock());
    }

    @PostMapping
    public ResponseEntity<Ingrediente> crear(@RequestBody Ingrediente ingrediente) {
        return ResponseEntity.ok(ingredienteService.guardar(ingrediente));
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<Ingrediente> actualizarStock(
            @PathVariable Integer id,
            @RequestParam Integer cantidad) {
        // Por ahora pasamos usuario 1 por defecto hasta implementar Security
        return ResponseEntity.ok(gestorStockFacade.registrarMovimiento(id, cantidad, 1));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        ingredienteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}