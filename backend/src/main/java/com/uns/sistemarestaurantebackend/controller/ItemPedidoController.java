package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.model.ItemPedido;
import com.uns.sistemarestaurantebackend.service.ItemPedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/items-pedido")
public class ItemPedidoController {

    @Autowired
    private ItemPedidoService itemPedidoService;

    @GetMapping("/comanda/{numeroComanda}")
    public List<ItemPedido> obtenerPorComanda(@PathVariable Integer numeroComanda) {
        return itemPedidoService.obtenerPorComanda(numeroComanda);
    }

    @GetMapping("/estado/{estado}")
    public List<ItemPedido> obtenerPorEstado(@PathVariable String estado) {
        return itemPedidoService.obtenerPorEstado(estado);
    }

    @PostMapping
    public ItemPedido crear(@RequestBody ItemPedido itemPedido) {
        return itemPedidoService.guardar(itemPedido);
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