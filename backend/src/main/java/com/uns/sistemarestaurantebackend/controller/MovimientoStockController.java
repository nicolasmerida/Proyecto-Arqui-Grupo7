package com.uns.sistemarestaurantebackend.controller;

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

    // Inyección doble recomendada por constructor
    public MovimientoStockController(MovStockService movStockService, GestorStockFacade gestorStockFacade) {
        this.movStockService = movStockService;
        this.gestorStockFacade = gestorStockFacade;
    }

    @GetMapping("/ingrediente/{idIngrediente}")
    public ResponseEntity<List<MovStock>> obtenerPorIngrediente(@PathVariable Integer idIngrediente) {
        return ResponseEntity.ok(movStockService.obtenerPorIngrediente(idIngrediente));
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<MovStock>> obtenerPorUsuario(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(movStockService.obtenerPorUsuario(idUsuario));
    }

    // HU-09/HU-12: registrar un movimiento manual de stock (reposición o ajuste)
    // La lógica real (validar, lockear, auditar) ocurre dentro del Facade.
    @PostMapping
    public ResponseEntity<Ingrediente> registrar(
            @RequestParam Integer idIngrediente,
            @RequestParam Integer cantidad,
            @RequestParam Integer idUsuario) {
        Ingrediente ingredienteActualizado = gestorStockFacade.registrarMovimiento(idIngrediente, cantidad, idUsuario);
        return ResponseEntity.ok(ingredienteActualizado);
    }
}