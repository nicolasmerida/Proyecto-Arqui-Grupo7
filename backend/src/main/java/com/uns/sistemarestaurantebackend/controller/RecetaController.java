package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.model.Receta;
import com.uns.sistemarestaurantebackend.service.RecetaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/recetas")
public class RecetaController {

    @Autowired
    private RecetaService recetaService;

    @GetMapping("/plato/{idPlato}")
    public List<Receta> obtenerPorPlato(@PathVariable Integer idPlato) {
        return recetaService.obtenerPorPlato(idPlato);
    }

    @PostMapping
    public Receta crear(@RequestBody Receta receta) {
        return recetaService.guardar(receta);
    }

    @DeleteMapping
    public ResponseEntity<Void> eliminar(@RequestBody Receta.RecetaId id) {
        recetaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}