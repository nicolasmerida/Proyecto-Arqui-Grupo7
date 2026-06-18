package com.uns.sistemarestaurantebackend.controller;

import com.uns.sistemarestaurantebackend.service.MpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/pagos")
public class MpController {

    @Autowired
    private MpService mpService;

    @PostMapping("/crear")
    public String crearPago(@RequestBody Map<String, Integer> payload) {
        // Extraemos el idMesa que nos manda el frontend en el JSON
        Integer idMesa = payload.get("idMesa");
        return mpService.crearPreferencia(idMesa);
    }
}