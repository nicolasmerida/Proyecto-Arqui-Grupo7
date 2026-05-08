package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.model.Comanda;
import com.uns.sistemarestaurantebackend.model.enums.EstadoComanda;
import com.uns.sistemarestaurantebackend.repository.ComandaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ComandaService {

    @Autowired
    private ComandaRepository comandaRepository;

    public List<Comanda> obtenerTodas() {
        return comandaRepository.findAll();
    }

    public Optional<Comanda> obtenerPorId(Integer id) {
        return comandaRepository.findById(id);
    }

    public Optional<Comanda> obtenerPorMesa(Integer numeroMesa) {
        return comandaRepository.findByMesaNumeroMesa(numeroMesa);
    }

    public List<Comanda> obtenerPorEstado(String estado) {
        return comandaRepository.findByEstadoComanda(EstadoComanda.fromValor(estado));
    }

    public Comanda guardar(Comanda comanda) {
        return comandaRepository.save(comanda);
    }

    public Comanda cambiarEstado(Integer id, String nuevoEstado) {
        // TODO: validar transiciones de estado validas
        // TODO: notificar via WebSocket al cambiar estado
        Comanda comanda = comandaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Comanda no encontrada"));
        comanda.setEstadoComanda(EstadoComanda.fromValor(nuevoEstado));
        return comandaRepository.save(comanda);
    }

    public void eliminar(Integer id) {
        comandaRepository.deleteById(id);
    }
}
