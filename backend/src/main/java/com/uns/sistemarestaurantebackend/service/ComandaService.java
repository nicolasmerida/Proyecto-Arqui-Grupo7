package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.model.Comanda;
import com.uns.sistemarestaurantebackend.model.ItemPedido;
import com.uns.sistemarestaurantebackend.model.enums.EstadoComanda;
import com.uns.sistemarestaurantebackend.model.enums.EstadoItem;
import com.uns.sistemarestaurantebackend.repository.ComandaRepository;
import com.uns.sistemarestaurantebackend.model.Mesa;
import com.uns.sistemarestaurantebackend.repository.ItemPedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ComandaService {

    @Autowired
    private ComandaRepository comandaRepository;

    @Autowired
    private ItemPedidoRepository itemPedidoRepository;

    @Autowired
    private WebSocketNotificacionService wsNotificacionService;

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
        Comanda comanda = comandaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comanda no encontrada"));

        EstadoComanda estadoActual = comanda.getEstadoComanda(); // guardo el estado actual
        EstadoComanda estadoNuevo = EstadoComanda.fromValor(nuevoEstado);

        validarTransicion(estadoActual, estadoNuevo); // Valido el actual con el nuevo

        comanda.setEstadoComanda(estadoNuevo);

        Comanda comandaActualizada = comandaRepository.save(comanda);

    
        wsNotificacionService.notificarCambioEstadoComanda(id, nuevoEstado); //Notificamos al websocket

        return comandaActualizada;
    }

    private void validarTransicion(EstadoComanda actual, EstadoComanda nuevo) {
        boolean valida = false;
        switch (actual) {
            case ABIERTA:
                valida = (nuevo == EstadoComanda.EN_PREPARACION || nuevo == EstadoComanda.CANCELADA);
                break;
            case EN_PREPARACION:
                valida = (nuevo == EstadoComanda.LISTA);
                break;
            case LISTA:
                valida = (nuevo == EstadoComanda.ENTREGADA);
                break;
            case ENTREGADA:
                valida = (nuevo == EstadoComanda.CERRADA);
                break;
            case CANCELADA:
            case CERRADA:
                valida = false; // Estados finales, no pueden cambiar
                break;
        }

        if (!valida) {
            throw new IllegalStateException(
                    "Transición de estado inválida: no se puede pasar de " + actual.name() + " a " + nuevo.name());
        }
    }

    public Comanda crearComandaParaMesa(Mesa mesa) {
        Comanda comanda = Comanda.builder()
                .mesa(mesa)
                .estadoComanda(EstadoComanda.ABIERTA)
                .fecha(java.time.LocalDateTime.now())
                .build();
        return comandaRepository.save(comanda);
    }

    // HU-03: sumar precio*cantidad de cada item no cancelado de la comanda
    public BigDecimal calcularTotal(Integer idComanda) {
        Comanda comanda = comandaRepository.findById(idComanda)
                .orElseThrow(() -> new RuntimeException("Comanda no encontrada"));

        List<ItemPedido> items = itemPedidoRepository.findByComanda(comanda);
        BigDecimal total = BigDecimal.ZERO;

        for (ItemPedido item : items) {
            if (item.getEstadoItem() != EstadoItem.CANCELADO) {
                BigDecimal subtotal = item.getPlato().getPrecio()
                        .multiply(BigDecimal.valueOf(item.getCantidad()));
                total = total.add(subtotal);
            }
        }

        return total;
    }

    public void eliminar(Integer id) {
        comandaRepository.deleteById(id);
    }
}
