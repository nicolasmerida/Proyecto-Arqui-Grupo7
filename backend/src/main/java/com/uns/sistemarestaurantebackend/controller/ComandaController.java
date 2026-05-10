package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.model.Comanda;
import com.uns.sistemarestaurantebackend.service.ComandaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Optional;
import java.util.List;


@RestController
@RequestMapping("/comandas")
public class ComandaController {

    @Autowired
    private ComandaService comandaService;

    @GetMapping
    public List<Comanda> obtenerTodas() {
        return comandaService.obtenerTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comanda> obtenerPorId(@PathVariable Integer id) {
        return comandaService.obtenerPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/mesa/{numeroMesa}")
    public Optional<Comanda> obtenerPorMesa(@PathVariable Integer numeroMesa) {
        return comandaService.obtenerPorMesa(numeroMesa);
    }

    @GetMapping("/estado/{estado}")
    public List<Comanda> obtenerPorEstado(@PathVariable String estado) {
        return comandaService.obtenerPorEstado(estado);
    }

    @PostMapping
    public Comanda crear(@RequestBody Comanda comanda) {
        return comandaService.guardar(comanda);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Comanda> cambiarEstado(
            @PathVariable Integer id,
            @RequestParam String nuevoEstado) {
        return ResponseEntity.ok(comandaService.cambiarEstado(id, nuevoEstado));
    }

    // HU-03: el mozo consulta el total antes de cobrar
    @GetMapping("/{id}/total")
    public ResponseEntity<BigDecimal> obtenerTotal(@PathVariable Integer id) {
        return ResponseEntity.ok(comandaService.calcularTotal(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        comandaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}