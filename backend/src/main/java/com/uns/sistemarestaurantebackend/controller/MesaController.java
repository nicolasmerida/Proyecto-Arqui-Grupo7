package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.model.Mesa;
import com.uns.sistemarestaurantebackend.service.MesaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mesas")
public class MesaController {

    private final MesaService mesaService;

    // Inyección recomendada por constructor de la industria
    public MesaController(MesaService mesaService) {
        this.mesaService = mesaService;
    }

    @GetMapping
    public ResponseEntity<List<Mesa>> obtenerTodas() {
        return ResponseEntity.ok(mesaService.obtenerTodas());
    }

    @GetMapping("/{numero}")
    public ResponseEntity<Mesa> obtenerPorNumero(@PathVariable Integer numero) {
        // Super limpio: si no existe, el Service tira la excepción y ataja el GlobalExceptionHandler
        return ResponseEntity.ok(mesaService.obtenerPorNumero(numero));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Mesa>> obtenerPorEstado(@PathVariable String estado) {
        return ResponseEntity.ok(mesaService.obtenerPorEstado(estado));
    }

    @PostMapping
    public ResponseEntity<Mesa> crear(@RequestBody Mesa mesa) {
        return ResponseEntity.ok(mesaService.guardar(mesa));
    }

    @PutMapping("/{numero}/abrir")
    public ResponseEntity<Mesa> abrir(@PathVariable Integer numero, @RequestParam Integer numeroComensales) {
        return ResponseEntity.ok(mesaService.abrirMesa(numero, numeroComensales));
    }

    @PutMapping("/{numero}/cerrar")
    public ResponseEntity<Mesa> cerrar(@PathVariable Integer numero) {
        return ResponseEntity.ok(mesaService.cerrarMesa(numero));
    }

    @DeleteMapping("/{numero}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer numero) {
        mesaService.eliminar(numero);
        return ResponseEntity.noContent().build();
    }
}