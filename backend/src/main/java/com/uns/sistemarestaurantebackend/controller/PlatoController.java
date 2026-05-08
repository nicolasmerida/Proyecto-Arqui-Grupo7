package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.model.Plato;
import com.uns.sistemarestaurantebackend.service.PlatoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/platos")
public class PlatoController {

    @Autowired
    private PlatoService platoService;

    @GetMapping
    public List<Plato> obtenerTodos() {
        return platoService.obtenerTodos();
    }

    @GetMapping("/activos")
    public List<Plato> obtenerActivos() {
        return platoService.obtenerActivos();
    }

    @GetMapping("/categoria/{idCategoria}")
    public List<Plato> obtenerPorCategoria(@PathVariable Integer idCategoria) {
        return platoService.obtenerPorCategoria(idCategoria);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Plato> obtenerPorId(@PathVariable Integer id) {
        return platoService.obtenerPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Plato crear(@RequestBody Plato plato) {
        return platoService.guardar(plato);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Plato> actualizar(@PathVariable Integer id, @RequestBody Plato plato) {
        return platoService.obtenerPorId(id)
            .map(p -> {
                plato.setIdPlato(id);
                return ResponseEntity.ok(platoService.guardar(plato));
            })
            .orElse(ResponseEntity.notFound().build());
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