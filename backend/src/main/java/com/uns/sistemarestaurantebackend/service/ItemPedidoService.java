package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.model.ItemPedido;
import com.uns.sistemarestaurantebackend.model.Receta;
import com.uns.sistemarestaurantebackend.model.enums.EstadoItem;
import com.uns.sistemarestaurantebackend.repository.ItemPedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ItemPedidoService {

    @Autowired
    private ItemPedidoRepository itemPedidoRepository;

    @Autowired
    private RecetaService recetaService;

    @Autowired
    private GestorStockFacade gestorStockFacade;

    public List<ItemPedido> obtenerPorComanda(Integer numeroComanda) {
        return itemPedidoRepository.findByComandaNumeroComanda(numeroComanda);
    }

    public List<ItemPedido> obtenerPorEstado(String estado) {
        return itemPedidoRepository.findByEstadoItem(EstadoItem.fromValor(estado));
    }

    public ItemPedido guardar(ItemPedido itemPedido) {
        return itemPedidoRepository.save(itemPedido);
    }

    @Transactional // para un futuro lo use websockets
    public ItemPedido cambiarEstado(ItemPedido.ItemPedidoId id, String nuevoEstado) {
        ItemPedido item = itemPedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));

        EstadoItem estadoActual = item.getEstadoItem();
        EstadoItem estadoNuevo = EstadoItem.fromValor(nuevoEstado);

        validarTransicionItem(estadoActual, estadoNuevo);

        item.setEstadoItem(estadoNuevo);
        // TODO: notificar al mozo via WebSocket
        // ejemplo: notificarWebSocket(guardado)
        ItemPedido guardado = itemPedidoRepository.save(item);
        return guardado;
    }

    private void validarTransicionItem(EstadoItem actual, EstadoItem nuevo) {
        boolean valida = false;
        switch (actual) {
            case PENDIENTE:
                // PENDIENTE → CANCELADO: stock se devuelve (nunca se cocinó)
                // EN_PREPARACION en adelante: no se puede cancelar, el plato ya está en camino
                valida = (nuevo == EstadoItem.EN_PREPARACION || nuevo == EstadoItem.CANCELADO);
                break;
            case EN_PREPARACION:
                // Una vez en preparacion, el flujo es lineal: no se puede cancelar
                valida = (nuevo == EstadoItem.LISTO);
                break;
            case LISTO:
                // El mozo retira el plato de la ventanilla
                valida = (nuevo == EstadoItem.ENTREGADO);
                break;
            case ENTREGADO:
            case CANCELADO:
                valida = false; // Estados finales, no pueden cambiar
                break;
        }

        if (!valida) {
            throw new IllegalStateException(
                    "Transición de estado inválida para item: no se puede pasar de "
                            + actual.name() + " a " + nuevo.name());
        }
    }

    public void eliminar(ItemPedido.ItemPedidoId id) {
        itemPedidoRepository.deleteById(id);
    }

    // En ItemPedidoController debe llamar a agregarItemAComanda en vez de
    // guardar()
    @Transactional
    public ItemPedido agregarItemAComanda(ItemPedido itemPedido) {
        itemPedido.setEstadoItem(EstadoItem.PENDIENTE);
        ItemPedido guardado = itemPedidoRepository.save(itemPedido);

        // 2. Obtener la receta del plato pedido
        // itemPedido.getPlato().getIdPlato() no debe ser nulo
        if (itemPedido.getPlato().getIdPlato() == null) {
            throw new IllegalStateException("El plato no tiene un ID");
        }
        List<Receta> recetas = recetaService.obtenerPorPlato(guardado.getPlato().getIdPlato());
        if (recetas.isEmpty()) {
            throw new IllegalStateException("El plato no tiene receta");
        }

        // 3. Descontar ingredientes de almacén/cocina
        for (Receta receta : recetas) {
            // cantidad requerida en receta * cantidad de platos pedidos por el cliente
            int cantidadADescontar = receta.getCantidad() * guardado.getCantidad();

            // enviamos la cantidad en negativo para que registrarMovimiento realice la
            // resta
            // Por ahora, asumimos usuario ID 1 (ej: un mozo default o admin) hasta que haya
            // Security
            gestorStockFacade.registrarMovimiento(receta.getIngrediente().getIdIngrediente(), -cantidadADescontar, 1);
        }
        // TODO: notificar a cocina vía WebSocket de nuevo pedido pendiente
        return guardado;
    }
}
