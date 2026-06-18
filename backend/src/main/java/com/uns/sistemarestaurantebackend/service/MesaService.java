package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.exception.NegocioException;
import com.uns.sistemarestaurantebackend.exception.RecursoNoEncontradoException;
import com.uns.sistemarestaurantebackend.model.Comanda;
import com.uns.sistemarestaurantebackend.model.Factura;
import com.uns.sistemarestaurantebackend.model.Mesa;
import com.uns.sistemarestaurantebackend.model.enums.EstadoComanda;
import com.uns.sistemarestaurantebackend.model.enums.EstadoMesa;
import com.uns.sistemarestaurantebackend.model.enums.MetodoPago;
import com.uns.sistemarestaurantebackend.repository.FacturaRepository;
import com.uns.sistemarestaurantebackend.repository.MesaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MesaService {

    // Inyección por constructor (Inmutable)
    private final MesaRepository mesaRepository;
    private final ComandaService comandaService;
    private final WebSocketNotificacionService wSocketNotificacionService;
    private final com.uns.sistemarestaurantebackend.dto.mapper.MesaMapper mesaMapper;

    // NUEVA DEPENDENCIA AGREGADA
    private final FacturaRepository facturaRepository;

    // NOTA SOBRE DEPENDENCIA CIRCULAR:
    // Como ComandaService NO inyecta a MesaService, es 100% seguro usar inyección por constructor acá.
    public MesaService(MesaRepository mesaRepository,
                       ComandaService comandaService,
                       WebSocketNotificacionService wSocketNotificacionService,
                       com.uns.sistemarestaurantebackend.dto.mapper.MesaMapper mesaMapper,
                       FacturaRepository facturaRepository) {
        this.mesaRepository = mesaRepository;
        this.comandaService = comandaService;
        this.wSocketNotificacionService = wSocketNotificacionService;
        this.mesaMapper = mesaMapper;
        this.facturaRepository = facturaRepository;
    }

    public List<Mesa> obtenerTodas() {
        return mesaRepository.findAll();
    }

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

        comandaService.crearComandaParaMesa(mesaGuardada);
        wSocketNotificacionService.notificarCambioSalon(mesaMapper.toDTO(mesaGuardada));

        return mesaGuardada;
    }

    // MÉTODO NUEVO PARA CERRAR LA MESA Y GUARDAR LA FACTURA (MERCADO PAGO)
    @Transactional
    public Mesa cerrarMesaConPago(Integer numeroMesa, String paymentId, String metodoPagoStr) {
        Mesa mesa = obtenerPorNumero(numeroMesa);

        Comanda comanda = comandaService.obtenerPorMesa(numeroMesa)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "COMANDA_ACTIVA_NO_ENCONTRADA",
                        "No hay una comanda activa para la mesa " + numeroMesa));

        // 1. Calculamos el total
        BigDecimal total = comandaService.calcularTotal(comanda.getNumeroComanda());

        // 2. Guardar la Factura
        Factura factura = Factura.builder()
                .fechaHora(LocalDateTime.now())
                .totalCobrado(total)
                .metodoPago(MetodoPago.fromValor(metodoPagoStr))
                .paymentId(paymentId)
                .numeroMesa(mesa.getNumeroMesa())
                .numeroComanda(comanda.getNumeroComanda())
                .build();
        facturaRepository.save(factura);

        // 3. Cerrar la Comanda
        comanda.setEstadoComanda(EstadoComanda.CERRADA);
        comandaService.guardar(comanda);

        // 4. Liberar la Mesa
        mesa.setEstadoMesa(EstadoMesa.LIBRE);
        mesa.setHoraDeApertura(null);
        Mesa mesaLiberada = mesaRepository.save(mesa);

        // Notificar por WebSocket
        wSocketNotificacionService.notificarCambioSalon(mesaMapper.toDTO(mesaLiberada));

        return mesaLiberada;
    }

    // MÉTODO CLÁSICO: Cierre manual sin registrar factura de MP (Efectivo o cancelación forzada)
    @Transactional
    public Mesa cerrarMesa(Integer numeroMesa) {
        Mesa mesa = obtenerPorNumero(numeroMesa);

        // Cerramos la comanda activa si existe usando ifPresent para no romper si no hay comanda
        comandaService.obtenerPorMesa(numeroMesa).ifPresent(comanda -> {
            comanda.setEstadoComanda(EstadoComanda.CERRADA);
            comandaService.guardar(comanda);
        });

        // Liberamos la mesa
        mesa.setEstadoMesa(EstadoMesa.LIBRE);
        mesa.setHoraDeApertura(null);
        Mesa mesaLiberada = mesaRepository.save(mesa);

        // Notificamos por WebSocket
        wSocketNotificacionService.notificarCambioSalon(mesaMapper.toDTO(mesaLiberada));

        return mesaLiberada;
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