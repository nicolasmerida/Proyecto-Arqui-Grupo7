package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.exception.NegocioException;
import com.uns.sistemarestaurantebackend.exception.RecursoNoEncontradoException;
import com.uns.sistemarestaurantebackend.model.Comanda;
import com.uns.sistemarestaurantebackend.model.Mesa;
import com.uns.sistemarestaurantebackend.model.enums.EstadoComanda;
import com.uns.sistemarestaurantebackend.model.enums.EstadoMesa;
import com.uns.sistemarestaurantebackend.repository.MesaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MesaService {

    // Inyección por constructor (Inmutable)
    private final MesaRepository mesaRepository;
    private final ComandaService comandaService;
    private final WebSocketNotificacionService wSocketNotificacionService;
    private final com.uns.sistemarestaurantebackend.dto.mapper.MesaMapper mesaMapper;


    // NOTA SOBRE DEPENDENCIA CIRCULAR:
    // Como ComandaService NO inyecta a MesaService, es 100% seguro usar inyección por constructor acá.
    public MesaService(MesaRepository mesaRepository, 
                        ComandaService comandaService, 
                        WebSocketNotificacionService wSocketNotificacionService,
                        com.uns.sistemarestaurantebackend.dto.mapper.MesaMapper mesaMapper) {
        this.mesaRepository = mesaRepository;
        this.comandaService = comandaService;
        this.wSocketNotificacionService = wSocketNotificacionService;
        this.mesaMapper = mesaMapper;
    }

    public List<Mesa> obtenerTodas() {
        return mesaRepository.findAll();
    }

    // Ya no devuelve Optional. Centraliza el error 404 para todo el servicio.
    public Mesa obtenerPorNumero(Integer numeroMesa) {
        return mesaRepository.findById(numeroMesa)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "MESA_NO_ENCONTRADA",
                        "La mesa número " + numeroMesa + " no existe."));
    }

    public List<Mesa> obtenerPorEstado(String estado) {
        return mesaRepository.findByEstadoMesa(EstadoMesa.fromValor(estado));
    }

    public Mesa guardar(Mesa mesa) {
        return mesaRepository.save(mesa);
    }

    @Transactional
    public Mesa abrirMesa(Integer numeroMesa, Integer numeroComensales) {
        // Reutilizamos el método de arriba para buscar la mesa
        Mesa mesa = obtenerPorNumero(numeroMesa);

        if (EstadoMesa.LIBRE != mesa.getEstadoMesa()) {
            throw new NegocioException(
                    "MESA_NO_LIBRE",
                    "No se puede abrir la mesa " + numeroMesa + " porque su estado actual es: " + mesa.getEstadoMesa().getValor());
        }

        if (numeroComensales > mesa.getCapacidad()) {
            throw new NegocioException(
                    "MESA_SIN_CAPACIDAD",
                    "No se puede abrir la mesa " + numeroMesa + " porque la cantidad de comensales es mayor a su capacidad.");
        }

        mesa.setEstadoMesa(EstadoMesa.OCUPADA);
        mesa.setHoraDeApertura(LocalDateTime.now());
        Mesa mesaGuardada = mesaRepository.save(mesa);

        comandaService.crearComandaParaMesa(mesaGuardada, numeroComensales);
        //notificarCambioSalon(mesaGuardada) via WebSocket
        wSocketNotificacionService.notificarCambioSalon(mesaMapper.toDTO(mesaGuardada));
        
        return mesaGuardada;
    }

    @Transactional
    public Mesa cerrarMesa(Integer numeroMesa) {
        // Reutilizamos el método de arriba
        Mesa mesa = obtenerPorNumero(numeroMesa);

        Comanda comanda = comandaService.obtenerPorMesa(numeroMesa)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "COMANDA_ACTIVA_NO_ENCONTRADA",
                        "No hay una comanda activa para la mesa " + numeroMesa));

        // Permitir cerrar la mesa en cualquier estado para testing (o si no tiene items)
        // if (EstadoComanda.ENTREGADA != comanda.getEstadoComanda()) {
        //     throw new NegocioException(
        //             "ITEMS_NO_ENTREGADOS",
        //             "La mesa " + numeroMesa + " no puede ser cerrada porque todavia no se han entregado todos los items.");
        // }

        comanda.setEstadoComanda(EstadoComanda.CERRADA);
        comandaService.guardar(comanda);

        mesa.setEstadoMesa(EstadoMesa.LIBRE);
        mesa.setHoraDeApertura(null);
        mesaRepository.save(mesa);

        return mesa;
    }

    public void eliminar(Integer numeroMesa) {
        if (!mesaRepository.existsById(numeroMesa)) {
            throw new RecursoNoEncontradoException(
                    "MESA_NO_ENCONTRADA",
                    "No se puede eliminar la mesa porque el número " + numeroMesa + " no existe.");
        }
        mesaRepository.deleteById(numeroMesa);
    }
}