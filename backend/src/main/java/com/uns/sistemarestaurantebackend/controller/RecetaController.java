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
    private final com.uns.sistemarestaurantebackend.dto.mapper.RecetaMapper recetaMapper;

    // Inyección por constructor
    public RecetaController(RecetaService recetaService, com.uns.sistemarestaurantebackend.dto.mapper.RecetaMapper recetaMapper) {
        this.recetaService = recetaService;
        this.recetaMapper = recetaMapper;
    }

    @GetMapping("/plato/{idPlato}")
    public ResponseEntity<List<com.uns.sistemarestaurantebackend.dto.RecetaDTO>> obtenerPorPlato(@PathVariable Integer idPlato) {
        List<Receta> recetas = recetaService.obtenerPorPlato(idPlato);
        return ResponseEntity.ok(recetaMapper.toDTOList(recetas));
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