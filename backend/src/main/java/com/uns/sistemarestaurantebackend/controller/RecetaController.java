package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.model.Receta;
import com.uns.sistemarestaurantebackend.service.RecetaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recetas")
public class RecetaController {

    private final RecetaService recetaService;

    // Inyección por constructor
    public RecetaController(RecetaService recetaService) {
        this.recetaService = recetaService;
    }

    @GetMapping("/plato/{idPlato}")
    public ResponseEntity<List<Receta>> obtenerPorPlato(@PathVariable Integer idPlato) {
        return ResponseEntity.ok(recetaService.obtenerPorPlato(idPlato));
    }

    @PostMapping
    public ResponseEntity<Receta> crear(@RequestBody Receta receta) {
        return ResponseEntity.ok(recetaService.guardar(receta));
    }

    @DeleteMapping
    public ResponseEntity<Void> eliminar(@RequestBody Receta.RecetaId id) {
        recetaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}