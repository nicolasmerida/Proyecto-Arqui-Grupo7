package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.dto.PlatoDTO;
import com.uns.sistemarestaurantebackend.dto.mapper.PlatoMapper;
import com.uns.sistemarestaurantebackend.model.Plato;
import com.uns.sistemarestaurantebackend.service.PlatoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/platos")
public class MenuController {

    private final PlatoService platoService;
    private final PlatoMapper platoMapper;

    public MenuController(PlatoService platoService, PlatoMapper platoMapper) {
        this.platoService = platoService;
        this.platoMapper = platoMapper;
    }

    @GetMapping
    public Page<PlatoDTO> getMenu(@RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "8") int size) {
        Page<Plato> platos = platoService.obtenerMenuPaginado(PageRequest.of(page, size));
        return platos.map(platoMapper::toDTO);
    }
}