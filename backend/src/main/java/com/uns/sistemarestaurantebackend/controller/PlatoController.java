package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.model.Plato;
import com.uns.sistemarestaurantebackend.service.PlatoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/platos")
public class PlatoController {

    private final PlatoService platoService;

    // Inyección por constructor
    public PlatoController(PlatoService platoService) {
        this.platoService = platoService;
    }

    @GetMapping
    public ResponseEntity<List<Plato>> obtenerTodos() {
        return ResponseEntity.ok(platoService.obtenerTodos());
    }

    @GetMapping("/activos")
    public ResponseEntity<List<Plato>> obtenerActivos() {
        return ResponseEntity.ok(platoService.obtenerActivos());
    }

    @GetMapping("/categoria/{idCategoria}")
    public ResponseEntity<List<Plato>> obtenerPorCategoria(@PathVariable Integer idCategoria) {
        return ResponseEntity.ok(platoService.obtenerPorCategoria(idCategoria));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Plato> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(platoService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<Plato> crear(@RequestBody Plato plato) {
        return ResponseEntity.ok(platoService.guardar(plato));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Plato> actualizar(@PathVariable Integer id, @RequestBody Plato plato) {
        // Toda la lógica pesada se fue al Service. El Controller respira.
        return ResponseEntity.ok(platoService.actualizar(id, plato));
    }

    @PutMapping("/{id}/toggle-activo")
    public ResponseEntity<Plato> toggleActivo(@PathVariable Integer id) {
        return ResponseEntity.ok(platoService.toggleActivo(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        platoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}