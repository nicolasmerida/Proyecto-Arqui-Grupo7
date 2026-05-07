package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.model.Comanda;
import com.uns.sistemarestaurantebackend.model.Mesa;
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

    @Autowired
    private ComandaService comandaService; //Importante: Si MesaService inyecta ComandaService, ComandaService no deberia poder inyectar MesaService, spring boot tira error.


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

    public Mesa abrirMesa(Integer numeroMesa, Integer numeroComensales) {

        Mesa mesa = mesaRepository.findById(numeroMesa)
            .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));

        if (!"LIBRE".equals(mesa.getEstadoMesa())){
            throw new IllegalStateException(
                "No se puede abrir la mesa" + numeroMesa + 
                " porque su estado actual es: " + mesa.getEstadoMesa()
            );
        }
        
        if (numeroComensales > mesa.getCapacidad()){
            throw new IllegalStateException(
                "No se puede abrir la mesa" + numeroMesa +
                " porque la cantidad de comnesales es mayor a su capacidad."
            );
        }

        mesa.setEstadoMesa("OCUPADA");
        mesa.setHorarioApertura(LocalDateTime.now());
        Mesa mesaGuardada = mesaRepository.save(mesa);

        //comandaService.crearComandaParaMesa(numeroMesa) TODO: agregar este metodo en el service de comanda.
        //notificarCambioSalon(mesaGuardada) TODO: notificar al websocket.

        return mesaGuardada;
    }

    public Mesa cerrarMesa(Integer numeroMesa) {
        // TODO: validar que todos los ítems estén entregados
        // TODO: generar cuenta
        Mesa mesa = mesaRepository.findById(numeroMesa)
            .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));

        Comanda comanda = comandaService.obtenerPorMesa(numeroMesa)
            .orElseThrow(() -> new RuntimeException("No hay comanda activa para esa mesa"));

        //Validamos que todos los items esten entregados.
        if (!"ENTREGADA".equals(comanda.getEstadoComanda())){
            throw new IllegalStateException(
                "La mesa " + numeroMesa + 
                " no puede ser cerrada porque todavia no se han entregado todos los items."
            );
        }

        //TODO: cerrar comanda

        mesa.setEstadoMesa("LIBRE");
        mesa.setHorarioApertura(null);
        mesaRepository.save(mesa);

        //notificarCambioSalon(mesaGuardada) TODO: notificar al websocket.
        //TODO: generar cuenta, depende de comandaservice

        return mesa;
    }

    public void eliminar(Integer numeroMesa) {
        mesaRepository.deleteById(numeroMesa);
    }
}