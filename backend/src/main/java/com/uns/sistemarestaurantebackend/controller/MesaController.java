package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.model.Mesa;
import com.uns.sistemarestaurantebackend.service.MesaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/mesas")
public class MesaController {

    @Autowired
    private MesaService mesaService;

    @GetMapping
    public List<Mesa> obtenerTodas() {
        return mesaService.obtenerTodas();
    }

    @GetMapping("/{numero}")
    public ResponseEntity<Mesa> obtenerPorNumero(@PathVariable Integer numero) {
        return mesaService.obtenerPorNumero(numero)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/estado/{estado}")
    public List<Mesa> obtenerPorEstado(@PathVariable String estado) {
        return mesaService.obtenerPorEstado(estado);
    }

    @PostMapping
    public Mesa crear(@RequestBody Mesa mesa) {
        return mesaService.guardar(mesa);
    }

    @PutMapping("/{numero}/abrir")
    public ResponseEntity<Mesa> abrir(@PathVariable Integer numero) {
        return ResponseEntity.ok(mesaService.abrirMesa(numero));
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