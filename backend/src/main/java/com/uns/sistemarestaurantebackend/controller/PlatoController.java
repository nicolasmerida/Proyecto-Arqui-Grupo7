package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.dto.PlatoDTO;
import com.uns.sistemarestaurantebackend.dto.mapper.PlatoMapper;
import com.uns.sistemarestaurantebackend.model.Plato;
import com.uns.sistemarestaurantebackend.service.PlatoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/platos")
public class PlatoController {

    private final PlatoService platoService;
    private final PlatoMapper platoMapper;

    public PlatoController(PlatoService platoService, PlatoMapper platoMapper) {
        this.platoService = platoService;
        this.platoMapper = platoMapper;
    }

    @GetMapping
    public ResponseEntity<List<PlatoDTO>> obtenerTodos() {
        List<Plato> platos = platoService.obtenerTodos();
        return ResponseEntity.ok(platoMapper.toDTOList(platos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlatoDTO> obtenerPorId(@PathVariable Integer id) {
        Plato plato = platoService.obtenerPorId(id);
        return ResponseEntity.ok(platoMapper.toDTO(plato));
    }

    @PostMapping
    public ResponseEntity<PlatoDTO> crear(@RequestBody PlatoDTO dto) {
        Plato guardado = platoService.guardar(platoMapper.toEntity(dto));
        return ResponseEntity.ok(platoMapper.toDTO(guardado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        platoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlatoDTO> actualizar(@PathVariable Integer id, @RequestBody PlatoDTO dto) {
        Plato actualizado = platoService.actualizar(id, platoMapper.toEntity(dto));
        return ResponseEntity.ok(platoMapper.toDTO(actualizado));
    }
}