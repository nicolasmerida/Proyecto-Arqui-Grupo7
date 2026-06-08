package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.exception.NegocioException;
import com.uns.sistemarestaurantebackend.exception.RecursoNoEncontradoException;
import com.uns.sistemarestaurantebackend.model.Plato;
import com.uns.sistemarestaurantebackend.model.enums.EstadoComanda;
import com.uns.sistemarestaurantebackend.model.enums.EstadoItem;
import com.uns.sistemarestaurantebackend.repository.ItemPedidoRepository;
import com.uns.sistemarestaurantebackend.repository.PlatoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlatoService {

    // Inyección inmutable por constructor
    private final PlatoRepository platoRepository;
    private final ItemPedidoRepository itemPedidoRepository;

    public PlatoService(PlatoRepository platoRepository, ItemPedidoRepository itemPedidoRepository) {
        this.platoRepository = platoRepository;
        this.itemPedidoRepository = itemPedidoRepository;
    }

    public List<Plato> obtenerTodos() {
        return platoRepository.findAll();
    }

    public List<Plato> obtenerActivos() {
        return platoRepository.findByActivoTrue();
    }

    public List<Plato> obtenerPorCategoria(Integer idCategoria) {
        return platoRepository.findByCategoriaIdCategoria(idCategoria);
    }

    // Centralizamos la búsqueda y el error 404 acá
    public Plato obtenerPorId(Integer id) {
        return platoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "PLATO_NO_ENCONTRADO",
                        "El plato con ID " + id + " no existe en el menú."
                ));
    }

    public Page<Plato> obtenerMenuPaginado(Pageable pageable) {
        return platoRepository.findByActivoTrue(pageable);
    }

    public Plato guardar(Plato plato) {
        return platoRepository.save(plato);
    }

    // Mudamos la lógica de actualizar desde el Controller hacia acá
    public Plato actualizar(Integer id, Plato platoActualizado) {
        obtenerPorId(id); // Reutilizamos: si no existe, corta acá y tira 404

        platoActualizado.setIdPlato(id);
        return platoRepository.save(platoActualizado);
    }

    public Plato toggleActivo(Integer id) {
        // Reutilizamos el método para no repetir el orElseThrow
        Plato plato = obtenerPorId(id);

        boolean seQuiereDesactivar = Boolean.TRUE.equals(plato.getActivo());

        if (seQuiereDesactivar) {
            boolean tienePedidosEnCurso =
                    itemPedidoRepository.existsByPlatoIdPlatoAndEstadoItemInAndComandaEstadoComandaIn(
                            id,
                            List.of(EstadoItem.PENDIENTE, EstadoItem.EN_PREPARACION),
                            List.of(EstadoComanda.ABIERTA, EstadoComanda.EN_PREPARACION)
                    );

            if (tienePedidosEnCurso) {
                // Usamos nuestra excepción con código SNAKE_CASE
                throw new NegocioException(
                        "PLATO_CON_PEDIDOS_ACTIVOS",
                        "No se puede desactivar el plato porque tiene pedidos pendientes o en preparación."
                );
            }
        }

        plato.setActivo(!Boolean.TRUE.equals(plato.getActivo()));
        return platoRepository.save(plato);
    }

    public void eliminar(Integer id) {
        // Reutilizamos el método
        Plato plato = obtenerPorId(id);

        boolean tienePedidosEnCurso =
                itemPedidoRepository.existsByPlatoIdPlatoAndEstadoItemInAndComandaEstadoComandaIn(
                        id,
                        List.of(EstadoItem.PENDIENTE, EstadoItem.EN_PREPARACION),
                        List.of(EstadoComanda.ABIERTA, EstadoComanda.EN_PREPARACION)
                );

        if (tienePedidosEnCurso) {
            throw new NegocioException(
                    "PLATO_CON_PEDIDOS_ACTIVOS",
                    "No se puede eliminar del menú el plato porque tiene pedidos pendientes o en preparación."
            );
        }

        // Borrado lógico excelente
        plato.setActivo(false);
        platoRepository.save(plato);
    }
}