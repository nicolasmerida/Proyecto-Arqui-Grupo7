package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.dto.IngredienteDTO;
import com.uns.sistemarestaurantebackend.dto.MovStockDTO;
import com.uns.sistemarestaurantebackend.dto.mapper.IngredienteMapper;
import com.uns.sistemarestaurantebackend.dto.mapper.MovStockMapper;
import com.uns.sistemarestaurantebackend.model.Ingrediente;
import com.uns.sistemarestaurantebackend.model.MovStock;
import com.uns.sistemarestaurantebackend.service.GestorStockFacade;
import com.uns.sistemarestaurantebackend.service.MovStockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movimientos-stock")
public class MovimientoStockController {

    private final MovStockService movStockService;
    private final GestorStockFacade gestorStockFacade;
    private final MovStockMapper movStockMapper;
    private final IngredienteMapper ingredienteMapper;

    public MovimientoStockController(MovStockService movStockService, GestorStockFacade gestorStockFacade, MovStockMapper movStockMapper, IngredienteMapper ingredienteMapper) {
        this.movStockService = movStockService;
        this.gestorStockFacade = gestorStockFacade;
        this.movStockMapper = movStockMapper;
        this.ingredienteMapper = ingredienteMapper;
    }

    @GetMapping
    public ResponseEntity<List<MovStockDTO>> obtenerTodos() {
        return ResponseEntity.ok(movStockMapper.toDTOList(movStockService.obtenerTodos()));
    }

    @GetMapping("/ingrediente/{idIngrediente}")
    public ResponseEntity<List<MovStockDTO>> obtenerPorIngrediente(@PathVariable Integer idIngrediente) {
        return ResponseEntity.ok(movStockMapper.toDTOList(movStockService.obtenerPorIngrediente(idIngrediente)));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<MovStockDTO>> obtenerPorUsuario(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(movStockMapper.toDTOList(movStockService.obtenerPorUsuario(idUsuario)));
    }

    // HU-09/HU-12: registrar un movimiento manual de stock (reposición o ajuste)
    // La lógica real (validar, lockear, auditar) ocurre dentro del Facade.
    @PostMapping
    public ResponseEntity<IngredienteDTO> registrar(
            @RequestParam Integer idIngrediente,
            @RequestParam Integer cantidad,
            @RequestParam Integer idUsuario) {
        Ingrediente ingredienteActualizado = gestorStockFacade.registrarMovimiento(idIngrediente, cantidad, idUsuario);
        return ResponseEntity.ok(ingredienteMapper.toDTO(ingredienteActualizado));
    }
}