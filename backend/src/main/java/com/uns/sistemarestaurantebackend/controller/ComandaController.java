package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.model.Comanda;
import com.uns.sistemarestaurantebackend.model.ItemPedido;
import com.uns.sistemarestaurantebackend.service.ComandaService;
import com.uns.sistemarestaurantebackend.service.ItemPedidoService;
import com.uns.sistemarestaurantebackend.dto.ComandaResumenDTO;
import com.uns.sistemarestaurantebackend.dto.ComandaDetalleDTO;
import com.uns.sistemarestaurantebackend.dto.mapper.ComandaMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/comandas")
public class ComandaController {

    @Autowired
    private ComandaService comandaService;

    @Autowired
    private ItemPedidoService itemPedidoService;

    @Autowired
    private ComandaMapper comandaMapper;

    @GetMapping
    public List<ComandaResumenDTO> obtenerTodas() {
        return comandaService.obtenerTodas().stream()
                .map(comandaMapper::toResumenDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/activas")
    public List<ComandaDetalleDTO> obtenerComandasActivas() {
        return comandaService.obtenerTodas().stream()
                .filter(c -> c.getEstadoComanda() == com.uns.sistemarestaurantebackend.model.enums.EstadoComanda.ABIERTA || 
                             c.getEstadoComanda() == com.uns.sistemarestaurantebackend.model.enums.EstadoComanda.EN_PREPARACION || 
                             c.getEstadoComanda() == com.uns.sistemarestaurantebackend.model.enums.EstadoComanda.LISTA)
                .map(comanda -> {
                    List<ItemPedido> items = itemPedidoService.obtenerPorComanda(comanda.getNumeroComanda());
                    return comandaMapper.toDetalleDTO(comanda, items);
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComandaDetalleDTO> obtenerPorId(@PathVariable Integer id) {
        return comandaService.obtenerPorId(id)
            .map(comanda -> {
                List<ItemPedido> items = itemPedidoService.obtenerPorComanda(comanda.getNumeroComanda());
                return ResponseEntity.ok(comandaMapper.toDetalleDTO(comanda, items));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/mesa/{numeroMesa}")
    public ResponseEntity<ComandaResumenDTO> obtenerPorMesa(@PathVariable Integer numeroMesa) {
        return comandaService.obtenerPorMesa(numeroMesa)
                .map(comandaMapper::toResumenDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/estado/{estado}")
    public List<ComandaResumenDTO> obtenerPorEstado(@PathVariable String estado) {
        return comandaService.obtenerPorEstado(estado).stream()
                .map(comandaMapper::toResumenDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<ComandaResumenDTO> crear(@RequestBody Comanda comanda) {
        Comanda guardada = comandaService.guardar(comanda);
        return ResponseEntity.ok(comandaMapper.toResumenDTO(guardada));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<com.uns.sistemarestaurantebackend.dto.ComandaResumenDTO> cambiarEstado(
            @PathVariable Integer id,
            @RequestBody com.uns.sistemarestaurantebackend.dto.ComandaEstadoInputDTO input) {
        Comanda actualizada = comandaService.cambiarEstado(id, input.getNuevoEstado());
        return ResponseEntity.ok(comandaMapper.toResumenDTO(actualizada));
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