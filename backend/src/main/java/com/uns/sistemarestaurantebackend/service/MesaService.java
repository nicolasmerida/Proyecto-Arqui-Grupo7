package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.model.Mesa;
import com.uns.sistemarestaurantebackend.repository.MesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MesaService {

    @Autowired
    private MesaRepository mesaRepository;

    public List<Mesa> obtenerTodas() {
        return mesaRepository.findAll();
    }

    public Optional<Mesa> obtenerPorNumero(Integer numeroMesa) {
        return mesaRepository.findById(numeroMesa);
    }

    public List<Mesa> obtenerPorEstado(String estado) {
        return mesaRepository.findByEstadoMesa(estado);
    }

    public Mesa guardar(Mesa mesa) {
        return mesaRepository.save(mesa);
    }

    public Mesa abrirMesa(Integer numeroMesa) {
        // TODO: validar que la mesa esté libre antes de abrir
        // TODO: crear comanda asociada
        Mesa mesa = mesaRepository.findById(numeroMesa)
            .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));
        mesa.setEstadoMesa("OCUPADA");
        return mesaRepository.save(mesa);
    }

    public Mesa cerrarMesa(Integer numeroMesa) {
        // TODO: validar que todos los ítems estén entregados
        // TODO: generar cuenta
        Mesa mesa = mesaRepository.findById(numeroMesa)
            .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));
        mesa.setEstadoMesa("LIBRE");
        return mesaRepository.save(mesa);
    }

    public void eliminar(Integer numeroMesa) {
        mesaRepository.deleteById(numeroMesa);
    }
}