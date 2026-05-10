package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.model.Comanda;
import com.uns.sistemarestaurantebackend.model.Mesa;
import com.uns.sistemarestaurantebackend.model.enums.EstadoComanda;
import com.uns.sistemarestaurantebackend.model.enums.EstadoMesa;
import com.uns.sistemarestaurantebackend.repository.MesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MesaService {

    @Autowired
    private MesaRepository mesaRepository;

    // NOTA: MesaService inyecta ComandaService. ComandaService NO puede inyectar
    // MesaService
    // (dependencia circular -> Spring tira error al arrancar).
    @Autowired
    private ComandaService comandaService;

    public List<Mesa> obtenerTodas() {
        return mesaRepository.findAll();
    }

    public Optional<Mesa> obtenerPorNumero(Integer numeroMesa) {
        return mesaRepository.findById(numeroMesa);
    }

    public List<Mesa> obtenerPorEstado(String estado) {
        return mesaRepository.findByEstadoMesa(EstadoMesa.fromValor(estado));
    }

    public Mesa guardar(Mesa mesa) {
        return mesaRepository.save(mesa);
    }

    public Mesa abrirMesa(Integer numeroMesa, Integer numeroComensales) {
        Mesa mesa = mesaRepository.findById(numeroMesa)
                .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));

        if (EstadoMesa.LIBRE != mesa.getEstadoMesa()) {
            throw new IllegalStateException(
                    "No se puede abrir la mesa " + numeroMesa +
                            " porque su estado actual es: " + mesa.getEstadoMesa().getValor());
        }

        if (numeroComensales > mesa.getCapacidad()) {
            throw new IllegalStateException(
                    "No se puede abrir la mesa " + numeroMesa +
                            " porque la cantidad de comensales es mayor a su capacidad.");
        }

        mesa.setEstadoMesa(EstadoMesa.OCUPADA);
        mesa.setHoraDeApertura(LocalDateTime.now());
        Mesa mesaGuardada = mesaRepository.save(mesa);

        // HU-02: Al abrir la mesa creamos automáticamente la comanda activa
        // (en vez de contruir la comanda aca, se construyo en clase comanda)
        comandaService.crearComandaParaMesa(mesaGuardada);

        // TODO: notificarCambioSalon(mesaGuardada) via WebSocket

        return mesaGuardada;
    }

    public Mesa cerrarMesa(Integer numeroMesa) {
        Mesa mesa = mesaRepository.findById(numeroMesa)
                .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));

        Comanda comanda = comandaService.obtenerPorMesa(numeroMesa)
                .orElseThrow(() -> new RuntimeException("No hay comanda activa para esa mesa"));

        if (EstadoComanda.ENTREGADA != comanda.getEstadoComanda()) {
            throw new IllegalStateException(
                    "La mesa " + numeroMesa +
                            " no puede ser cerrada porque todavia no se han entregado todos los items.");
        }

        // Cierra la comanda — queda como historial asociada a la mesa (no se desliga)
        comanda.setEstadoComanda(EstadoComanda.CERRADA);
        comandaService.guardar(comanda);

        mesa.setEstadoMesa(EstadoMesa.LIBRE);
        mesa.setHoraDeApertura(null);
        mesaRepository.save(mesa);

        return mesa;
    }

    public void eliminar(Integer numeroMesa) {
        mesaRepository.deleteById(numeroMesa);
    }
}
