package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.model.Ingrediente;
import com.uns.sistemarestaurantebackend.model.MovStock;
import com.uns.sistemarestaurantebackend.service.GestorStockFacade;
import com.uns.sistemarestaurantebackend.service.MovStockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/movimientos-stock")
public class MovimientoStockController {

    @Autowired
    private MovStockService movStockService;

    // GestorStockFacade es el único punto de entrada para registrar movimientos.
    // Garantiza: bloqueo pesimista + actualización de stock físico + auditoría.
    @Autowired
    private GestorStockFacade gestorStockFacade;

    @GetMapping("/ingrediente/{idIngrediente}")
    public List<MovStock> obtenerPorIngrediente(@PathVariable Integer idIngrediente) {
        return movStockService.obtenerPorIngrediente(idIngrediente);
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<MovStock> obtenerPorUsuario(@PathVariable Integer idUsuario) {
        return movStockService.obtenerPorUsuario(idUsuario);
    }

    // HU-09/HU-12: registrar un movimiento manual de stock (reposición o ajuste)
    // Se reciben los parámetros por separado para no exponer la entidad MovStock al cliente.
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