package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.dto.ItemPedidoDTO;
import com.uns.sistemarestaurantebackend.dto.mapper.ItemPedidoMapper;
import com.uns.sistemarestaurantebackend.model.ItemPedido;
import com.uns.sistemarestaurantebackend.model.ItemPedido.ItemPedidoId;
import com.uns.sistemarestaurantebackend.service.ItemPedidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/items-pedido")
public class ItemPedidoController {

    private final ItemPedidoService itemPedidoService;
    private final ItemPedidoMapper itemPedidoMapper;

    public ItemPedidoController(ItemPedidoService itemPedidoService, ItemPedidoMapper itemPedidoMapper) {
        this.itemPedidoService = itemPedidoService;
        this.itemPedidoMapper = itemPedidoMapper;
    }

    @GetMapping("/comanda/{numeroComanda}")
    public ResponseEntity<List<ItemPedidoDTO>> obtenerPorComanda(@PathVariable Integer numeroComanda) {
        List<ItemPedido> items = itemPedidoService.obtenerPorComanda(numeroComanda);
        return ResponseEntity.ok(items.stream().map(itemPedidoMapper::toDTO).toList());
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<ItemPedidoDTO>> obtenerPorEstado(@PathVariable String estado) {
        List<ItemPedido> items = itemPedidoService.obtenerPorEstado(estado);
        return ResponseEntity.ok(items.stream().map(itemPedidoMapper::toDTO).toList());
    }

    @GetMapping("/ventas")
    public ResponseEntity<List<Map<String, Object>>> obtenerTopVentas() {
        return ResponseEntity.ok(itemPedidoService.obtenerTopVentas());
    }

    @PostMapping
    public ResponseEntity<ItemPedidoDTO> guardar(@RequestBody ItemPedidoDTO dto) {
        ItemPedido item = itemPedidoMapper.toEntity(dto);
        ItemPedido guardado = itemPedidoService.guardar(item);
        return ResponseEntity.ok(itemPedidoMapper.toDTO(guardado));
    }

    @PutMapping("/estado")
    public ResponseEntity<ItemPedidoDTO> cambiarEstado(@RequestParam Integer numeroComanda,
                                                       @RequestParam Integer idPlato,
                                                       @RequestParam String nuevoEstado) {
        ItemPedidoId id = new ItemPedidoId(numeroComanda, idPlato);
        ItemPedido actualizado = itemPedidoService.cambiarEstado(id, nuevoEstado);
        return ResponseEntity.ok(itemPedidoMapper.toDTO(actualizado));
    }

    @DeleteMapping
    public ResponseEntity<Void> eliminar(@RequestParam Integer numeroComanda,
                                         @RequestParam Integer idPlato) {
        ItemPedidoId id = new ItemPedidoId(numeroComanda, idPlato);
        itemPedidoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}