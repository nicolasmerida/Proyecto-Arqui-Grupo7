package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.model.ItemPedido;
import com.uns.sistemarestaurantebackend.service.ItemPedidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/items-pedido")
public class ItemPedidoController {

    private final ItemPedidoService itemPedidoService;

    // Inyección recomendada por constructor de la industria
    public ItemPedidoController(ItemPedidoService itemPedidoService) {
        this.itemPedidoService = itemPedidoService;
    }

    @GetMapping("/comanda/{numeroComanda}")
    public ResponseEntity<List<ItemPedido>> obtenerPorComanda(@PathVariable Integer numeroComanda) {
        return ResponseEntity.ok(itemPedidoService.obtenerPorComanda(numeroComanda));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<ItemPedido>> obtenerPorEstado(@PathVariable String estado) {
        return ResponseEntity.ok(itemPedidoService.obtenerPorEstado(estado));
    }

    @PostMapping
    public ResponseEntity<ItemPedido> crear(@RequestBody ItemPedido itemPedido) {
        return ResponseEntity.ok(itemPedidoService.agregarItemAComanda(itemPedido));
    }

    @PutMapping("/estado")
    public ResponseEntity<ItemPedido> cambiarEstado(
            @RequestBody ItemPedido.ItemPedidoId id,
            @RequestParam String nuevoEstado) {
        return ResponseEntity.ok(itemPedidoService.cambiarEstado(id, nuevoEstado));
    }

    @DeleteMapping
    public ResponseEntity<Void> eliminar(@RequestBody ItemPedido.ItemPedidoId id) {
        itemPedidoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}