package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.model.Plato;
import com.uns.sistemarestaurantebackend.model.enums.EstadoComanda;
import com.uns.sistemarestaurantebackend.model.enums.EstadoItem;
import com.uns.sistemarestaurantebackend.repository.ItemPedidoRepository;
import com.uns.sistemarestaurantebackend.repository.PlatoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Service
public class PlatoService {

    @Autowired
    private PlatoRepository platoRepository;

    @Autowired
    private ItemPedidoRepository itemPedidoRepository;

    public List<Plato> obtenerTodos() {
        return platoRepository.findAll();
    }

    public List<Plato> obtenerActivos() {
        return platoRepository.findByActivoTrue();
    }

    public List<Plato> obtenerPorCategoria(Integer idCategoria) {
        return platoRepository.findByCategoriaIdCategoria(idCategoria);
    }

    public Optional<Plato> obtenerPorId(Integer id) {
        return platoRepository.findById(id);
    }

    public Page<Plato> obtenerMenuPaginado(Pageable pageable) {
        return platoRepository.findByActivoTrue(pageable);
    }

    public Plato guardar(Plato plato) {
        return platoRepository.save(plato);
    }

    public Plato toggleActivo(Integer id) {
        Plato plato = platoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plato no encontrado"));

        boolean seQuiereDesactivar = Boolean.TRUE.equals(plato.getActivo());

        if (seQuiereDesactivar) {
            boolean tienePedidosEnCurso =
                    itemPedidoRepository.existsByPlatoIdPlatoAndEstadoItemInAndComandaEstadoComandaIn(
                            id,
                            List.of(EstadoItem.PENDIENTE, EstadoItem.EN_PREPARACION),
                            List.of(EstadoComanda.ABIERTA, EstadoComanda.EN_PREPARACION)
                    );

            if (tienePedidosEnCurso) {
                throw new RuntimeException(
                        "No se puede desactivar el plato porque tiene pedidos pendientes o en preparación"
                );
            }
        }

        plato.setActivo(!Boolean.TRUE.equals(plato.getActivo()));

        return platoRepository.save(plato);
    }

    public void eliminar(Integer id) {
        Plato plato = platoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plato no encontrado"));

        boolean tienePedidosEnCurso =
                itemPedidoRepository.existsByPlatoIdPlatoAndEstadoItemInAndComandaEstadoComandaIn(
                        id,
                        List.of(EstadoItem.PENDIENTE, EstadoItem.EN_PREPARACION),
                        List.of(EstadoComanda.ABIERTA, EstadoComanda.EN_PREPARACION)
                );

        if (tienePedidosEnCurso) {
            throw new RuntimeException(
                    "No se puede eliminar del menú el plato porque tiene pedidos pendientes o en preparación"
            );
        }

        plato.setActivo(false);
        platoRepository.save(plato);
    }
}