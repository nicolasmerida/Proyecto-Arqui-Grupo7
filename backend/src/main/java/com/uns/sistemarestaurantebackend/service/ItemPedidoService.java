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

    public List<ItemPedido> obtenerPorComanda(Integer numeroComanda) {
        return itemPedidoRepository.findByComandaNumeroComanda(numeroComanda);
    }

    public List<ItemPedido> obtenerPorEstado(String estado) {
        return itemPedidoRepository.findByEstadoItem(EstadoItem.fromValor(estado));
    }

    public ItemPedido guardar(ItemPedido itemPedido) {
        return itemPedidoRepository.save(itemPedido);
    }

    @Transactional // para un futuro cuando esten hechos los TODO
    public ItemPedido cambiarEstado(ItemPedido.ItemPedidoId id, String nuevoEstado) {
        // TODO: notificar al mozo via WebSocket
        ItemPedido item = itemPedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));
        item.setEstadoItem(EstadoItem.fromValor(nuevoEstado));
        return itemPedidoRepository.save(item);
    }

    public void eliminar(ItemPedido.ItemPedidoId id) {
        itemPedidoRepository.deleteById(id);
    }

    @Autowired
    private RecetaService recetaService;

    @Autowired
    private GestorStockFacade gestorStockFacade;

    // En ItemPedidoControllere debe llamar a agregarItemAComanda en vez de
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

            // enviamos la cantidad en negativo para que registrarMovimiento realice la resta
            // Por ahora, asumimos usuario ID 1 (ej: un mozo default o admin) hasta que haya Security
            gestorStockFacade.registrarMovimiento(receta.getIngrediente().getIdIngrediente(), -cantidadADescontar, 1);
        }
        // TODO: notificar a cocina vía WebSocket de nuevo pedido pendiente
        return guardado;
    }
}
