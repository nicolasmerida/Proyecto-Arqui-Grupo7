package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.model.Ingrediente;
import com.uns.sistemarestaurantebackend.service.GestorStockFacade;
import com.uns.sistemarestaurantebackend.service.IngredienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/ingredientes")
public class IngredienteController {

    @Autowired
    private IngredienteService ingredienteService;

    @Autowired
    private GestorStockFacade gestorStockFacade;

    @GetMapping
    public List<Ingrediente> obtenerTodos() {
        return ingredienteService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ingrediente> obtenerPorId(@PathVariable Integer id) {
        return ingredienteService.obtenerPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/bajo-stock")
    public List<Ingrediente> obtenerBajoStock() {
        return ingredienteService.obtenerBajoStock();
    }

    @PostMapping
    public Ingrediente crear(@RequestBody Ingrediente ingrediente) {
        return ingredienteService.guardar(ingrediente);
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