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
}