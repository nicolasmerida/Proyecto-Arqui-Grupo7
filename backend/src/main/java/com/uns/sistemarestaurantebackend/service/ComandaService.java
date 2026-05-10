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
