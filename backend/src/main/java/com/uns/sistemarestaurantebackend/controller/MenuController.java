package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.model.Plato;
import com.uns.sistemarestaurantebackend.service.PlatoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/menu")
public class MenuController {

    @Autowired
    private PlatoService platoService;

    @GetMapping
    public Page<Plato> getMenu(@RequestParam(defaultValue = "0") int page,
                                @RequestParam(defaultValue = "8") int size) {
        return platoService.obtenerMenuPaginado(PageRequest.of(page, size));
    }
}    

