package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.dto.MesaDTO;
import com.uns.sistemarestaurantebackend.dto.mapper.MesaMapper;
import com.uns.sistemarestaurantebackend.model.Mesa;
import com.uns.sistemarestaurantebackend.service.MesaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mesas")
public class MesaController {

    private final MesaService mesaService;
    private final MesaMapper mesaMapper;

    public MesaController(MesaService mesaService, MesaMapper mesaMapper) {
        this.mesaService = mesaService;
        this.mesaMapper = mesaMapper;
    }

    @GetMapping
    public ResponseEntity<List<MesaDTO>> obtenerTodas() {
        List<Mesa> mesas = mesaService.obtenerTodas();
        return ResponseEntity.ok(mesaMapper.toDTOList(mesas));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MesaDTO> obtenerPorId(@PathVariable Integer id) {
        Mesa mesa = mesaService.obtenerPorNumero(id);
        return ResponseEntity.ok(mesaMapper.toDTO(mesa));
    }

    @PostMapping
    public ResponseEntity<MesaDTO> crear(@RequestBody MesaDTO dto) {
        Mesa guardada = mesaService.guardar(mesaMapper.toEntity(dto));
        return ResponseEntity.ok(mesaMapper.toDTO(guardada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        mesaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{numero}/estado")
    public ResponseEntity<MesaDTO> cambiarEstado(@PathVariable Integer numero, @RequestBody com.uns.sistemarestaurantebackend.dto.MesaEstadoInputDTO input) {
        Mesa mesa;
        if ("Ocupada".equalsIgnoreCase(input.getEstadoMesa())) {
            if (input.getNumeroComensales() == null) {
                return ResponseEntity.badRequest().build();
            }
            mesa = mesaService.abrirMesa(numero, input.getNumeroComensales());
        } else if ("Libre".equalsIgnoreCase(input.getEstadoMesa())) {
            mesa = mesaService.cerrarMesa(numero);
        } else {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(mesaMapper.toDTO(mesa));
    }

    // NUEVO ENDPOINT: Recibe la confirmación del pago desde el Frontend y libera la mesa
    @PostMapping("/{numeroMesa}/cerrar-pago")
    public ResponseEntity<?> cerrarMesaTrasPago(
            @PathVariable Integer numeroMesa,
            @RequestParam String paymentId,
            @RequestParam String metodoPago) {
        try {
            // Llama al servicio que guarda la Factura y libera la Mesa
            Mesa mesaLiberada = mesaService.cerrarMesaConPago(numeroMesa, paymentId, metodoPago);
            // Devuelve el DTO respetando la arquitectura de la capa de presentación
            return ResponseEntity.ok(mesaMapper.toDTO(mesaLiberada));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al procesar el pago de la mesa: " + e.getMessage());
        }
    }
}