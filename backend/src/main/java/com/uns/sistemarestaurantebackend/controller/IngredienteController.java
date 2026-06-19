package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.dto.IngredienteDTO;
import com.uns.sistemarestaurantebackend.dto.mapper.IngredienteMapper;
import com.uns.sistemarestaurantebackend.model.Ingrediente;
import com.uns.sistemarestaurantebackend.service.GestorStockFacade;
import com.uns.sistemarestaurantebackend.service.IngredienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ingredientes")
public class IngredienteController {

    private final IngredienteService ingredienteService;
    private final GestorStockFacade gestorStockFacade;
    private final IngredienteMapper ingredienteMapper;

    public IngredienteController(IngredienteService ingredienteService,
                                 GestorStockFacade gestorStockFacade,
                                 IngredienteMapper ingredienteMapper) {
        this.ingredienteService = ingredienteService;
        this.gestorStockFacade = gestorStockFacade;
        this.ingredienteMapper = ingredienteMapper;
    }

    @GetMapping
    public ResponseEntity<List<IngredienteDTO>> obtenerTodos() {
        List<Ingrediente> ingredientes = ingredienteService.obtenerTodos();
        return ResponseEntity.ok(ingredienteMapper.toDTOList(ingredientes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IngredienteDTO> obtenerPorId(@PathVariable Integer id) {
        Ingrediente ingrediente = ingredienteService.obtenerPorId(id);
        return ResponseEntity.ok(ingredienteMapper.toDTO(ingrediente));
    }

    @GetMapping("/bajo-stock")
    public ResponseEntity<List<IngredienteDTO>> obtenerBajoStock() {
        List<Ingrediente> ingredientes = ingredienteService.obtenerBajoStock();
        return ResponseEntity.ok(ingredienteMapper.toDTOList(ingredientes));
    }

    @PostMapping
    public ResponseEntity<IngredienteDTO> crear(@RequestBody IngredienteDTO ingredienteDTO) {
        Ingrediente ingrediente = ingredienteMapper.toEntity(ingredienteDTO);
        Ingrediente guardado = ingredienteService.guardar(ingrediente);
        return ResponseEntity.ok(ingredienteMapper.toDTO(guardado));
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<IngredienteDTO> actualizarStock(@PathVariable Integer id,
                                                          @RequestParam Integer cantidad,
                                                          @RequestHeader(value = "X-User-Id") Integer usuarioId) {
        Ingrediente actualizado = gestorStockFacade.registrarMovimiento(id, cantidad, usuarioId);
        return ResponseEntity.ok(ingredienteMapper.toDTO(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        ingredienteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}