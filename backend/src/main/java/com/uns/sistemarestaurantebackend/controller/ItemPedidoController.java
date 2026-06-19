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
    public ResponseEntity<ItemPedidoDTO> guardar(@RequestBody ItemPedidoDTO dto,
                                                 @RequestHeader(value = "X-User-Id") Integer usuarioId) {
        ItemPedido item = itemPedidoMapper.toEntity(dto);
        ItemPedido guardado = itemPedidoService.agregarItemAComanda(item, usuarioId);
        return ResponseEntity.ok(itemPedidoMapper.toDTO(guardado));
    }

    @PostMapping("/batch")
    public ResponseEntity<List<ItemPedidoDTO>> guardarLote(@RequestBody List<ItemPedidoDTO> dtos,
                                                           @RequestHeader(value = "X-User-Id") Integer usuarioId) {
        List<ItemPedido> items = dtos.stream().map(itemPedidoMapper::toEntity).collect(java.util.stream.Collectors.toList());
        List<ItemPedido> guardados = itemPedidoService.agregarItemsAComandaBatch(items, usuarioId);
        return ResponseEntity.ok(guardados.stream().map(itemPedidoMapper::toDTO).collect(java.util.stream.Collectors.toList()));
    }

    @PutMapping("/{numeroComanda}/{idPlato}/estado")
    public ResponseEntity<ItemPedidoDTO> cambiarEstado(
            @PathVariable Integer numeroComanda,
            @PathVariable Integer idPlato,
            @RequestBody com.uns.sistemarestaurantebackend.dto.ItemEstadoInputDTO input,
            @RequestHeader(value = "X-User-Id") Integer usuarioId) {
        ItemPedidoId id = new ItemPedidoId(numeroComanda, idPlato);
        ItemPedido actualizado = itemPedidoService.cambiarEstado(id, input.getNuevoEstado(), usuarioId);
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