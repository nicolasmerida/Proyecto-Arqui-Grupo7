package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.exception.NegocioException;
import com.uns.sistemarestaurantebackend.exception.RecursoNoEncontradoException;
import com.uns.sistemarestaurantebackend.model.ItemPedido;
import com.uns.sistemarestaurantebackend.model.Receta;
import com.uns.sistemarestaurantebackend.model.enums.EstadoItem;
import com.uns.sistemarestaurantebackend.repository.ItemPedidoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ItemPedidoService {

    // Inyección limpia y moderna por constructor (Inmutable)
    private final ItemPedidoRepository itemPedidoRepository;
    private final RecetaService recetaService;
    private final GestorStockFacade gestorStockFacade;
    private final WebSocketNotificacionService wsNotifiaNotificacionService;
    private final com.uns.sistemarestaurantebackend.dto.mapper.ComandaMapper comandaMapper;
    private final com.uns.sistemarestaurantebackend.dto.mapper.ItemPedidoMapper itemPedidoMapper;
    private final com.uns.sistemarestaurantebackend.repository.ComandaRepository comandaRepository;

    public ItemPedidoService(ItemPedidoRepository itemPedidoRepository,
                             RecetaService recetaService,
                             GestorStockFacade gestorStockFacade,
                             WebSocketNotificacionService wsNotifiaNotificacionService,
                             com.uns.sistemarestaurantebackend.dto.mapper.ComandaMapper comandaMapper,
                             com.uns.sistemarestaurantebackend.dto.mapper.ItemPedidoMapper itemPedidoMapper,
                             com.uns.sistemarestaurantebackend.repository.ComandaRepository comandaRepository) {
        this.itemPedidoRepository = itemPedidoRepository;
        this.recetaService = recetaService;
        this.gestorStockFacade = gestorStockFacade;
        this.wsNotifiaNotificacionService = wsNotifiaNotificacionService;
        this.comandaMapper = comandaMapper;
        this.itemPedidoMapper = itemPedidoMapper;
        this.comandaRepository = comandaRepository;
    }

    public List<ItemPedido> obtenerPorComanda(Integer numeroComanda) {
        return itemPedidoRepository.findByComandaNumeroComanda(numeroComanda);
    }

    public List<ItemPedido> obtenerPorEstado(String estado) {
        return itemPedidoRepository.findByEstadoItem(EstadoItem.fromValor(estado));
    }

    public List<Map<String, Object>> obtenerTopVentas() {
        List<ItemPedido> todos = itemPedidoRepository.findAll();
        Map<Integer, Integer> ventasPorPlato = new HashMap<>();
        Map<Integer, com.uns.sistemarestaurantebackend.model.Plato> infoPlatos = new HashMap<>();

        for (ItemPedido item : todos) {
            if (item.getEstadoItem() != EstadoItem.CANCELADO) {
                Integer id = item.getPlato().getIdPlato();
                ventasPorPlato.put(id, ventasPorPlato.getOrDefault(id, 0) + item.getCantidad());
                infoPlatos.putIfAbsent(id, item.getPlato());
            }
        }

        return ventasPorPlato.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .limit(5)
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("cantidad", e.getValue());
                    com.uns.sistemarestaurantebackend.model.Plato p = infoPlatos.get(e.getKey());
                    Map<String, Object> platoReducido = new HashMap<>();
                    platoReducido.put("idPlato", p.getIdPlato());
                    platoReducido.put("nombre", p.getNombre());
                    map.put("plato", platoReducido);
                    return map;
                })
                .collect(Collectors.toList());
    }

    public ItemPedido guardar(ItemPedido itemPedido) {
        return itemPedidoRepository.save(itemPedido);
    }

    @Transactional
    public ItemPedido cambiarEstado(ItemPedido.ItemPedidoId id, String nuevoEstado, Integer idUsuario) {
        // Si la clave compuesta no existe, devolvemos un 404 estructurado
        ItemPedido item = itemPedidoRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "ITEM_PEDIDO_NO_ENCONTRADO",
                        "El ítem de pedido solicitado no existe en el sistema."
                ));

        EstadoItem estadoActual = item.getEstadoItem();
        EstadoItem estadoNuevo = EstadoItem.fromValor(nuevoEstado);

        // Valida la máquina de estados de cocina
        validarTransicionItem(estadoActual, estadoNuevo);

        // HU-14: si se cancela el item, devolver el stock que se habia descontado al pedirlo
        if (estadoNuevo == EstadoItem.CANCELADO) {
            List<Receta> recetas = recetaService.obtenerPorPlato(item.getPlato().getIdPlato());
            for (Receta receta : recetas) {
                int cantidadADevolver = receta.getCantidad() * item.getCantidad();
                // cantidad positiva = sumar al stock (inverso de agregarItemAComanda)
                gestorStockFacade.registrarMovimiento(
                        receta.getIngrediente().getIdIngrediente(), cantidadADevolver, idUsuario);
            }
        }

        item.setEstadoItem(estadoNuevo);
        ItemPedido guardado = itemPedidoRepository.save(item);

        // Evaluar auto-promoción de la Comanda
        com.uns.sistemarestaurantebackend.model.Comanda comanda = guardado.getComanda();
        List<ItemPedido> items = itemPedidoRepository.findByComandaNumeroComanda(comanda.getNumeroComanda());
        
        List<ItemPedido> activos = items.stream()
            .filter(i -> i.getEstadoItem() != EstadoItem.CANCELADO)
            .collect(Collectors.toList());

        if (!activos.isEmpty()) {
            boolean todosListos = activos.stream()
                .allMatch(i -> i.getEstadoItem() == EstadoItem.LISTO || i.getEstadoItem() == EstadoItem.ENTREGADO);
                
            boolean todosEnPreparacion = activos.stream()
                .allMatch(i -> i.getEstadoItem() == EstadoItem.EN_PREPARACION || i.getEstadoItem() == EstadoItem.LISTO || i.getEstadoItem() == EstadoItem.ENTREGADO);

            boolean cambioComanda = false;
            if (todosListos && comanda.getEstadoComanda() == com.uns.sistemarestaurantebackend.model.enums.EstadoComanda.EN_PREPARACION) {
                comanda.setEstadoComanda(com.uns.sistemarestaurantebackend.model.enums.EstadoComanda.LISTA);
                cambioComanda = true;
            } else if (todosEnPreparacion && comanda.getEstadoComanda() == com.uns.sistemarestaurantebackend.model.enums.EstadoComanda.ABIERTA) {
                comanda.setEstadoComanda(com.uns.sistemarestaurantebackend.model.enums.EstadoComanda.EN_PREPARACION);
                cambioComanda = true;
            }

            if (cambioComanda) {
                comandaRepository.save(comanda);
                wsNotifiaNotificacionService.notificarCambioEstadoComanda(comandaMapper.toResumenDTO(comanda));
            }
        }

        //notificar al mozo via WebSocket cuando el item este LISTO
        if (estadoNuevo == EstadoItem.LISTO) {
            wsNotifiaNotificacionService.notificarItemListo(itemPedidoMapper.toDTO(guardado));
        }

        // Notificar a cocina del cambio de estado para que React recargue la tarjeta automáticamente
        wsNotifiaNotificacionService.notificarNuevoPedidoCocina(comandaMapper.toDetalleDTO(comanda, items));

        return guardado;
    }

    private void validarTransicionItem(EstadoItem actual, EstadoItem nuevo) {
        boolean valida = false;
        switch (actual) {
            case PENDIENTE:
                // Solo desde PENDIENTE se puede cancelar: cocina todavia no lo tomó
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
            throw new NegocioException(
                    "TRANSICION_INVALIDA",
                    "No se permite cambiar el estado de este plato de " + actual.name() + " a " + nuevo.name() + " (Transición inválida)."
            );
        }
    }

    public void eliminar(ItemPedido.ItemPedidoId id) {
        // Evitamos que estalle JPA con error 500 usando la clave compuesta reglamentaria
        if (!itemPedidoRepository.existsById(id)) {
            throw new RecursoNoEncontradoException(
                    "ITEM_PEDIDO_NO_ENCONTRADO",
                    "No se puede eliminar porque el ítem de pedido no existe."
            );
        }
        itemPedidoRepository.deleteById(id);
    }

    @Transactional
    public ItemPedido agregarItemAComanda(ItemPedido itemPedido, Integer idUsuario) {
        ItemPedido guardado = procesarYGuardarItem(itemPedido, idUsuario);

        //notificar a cocina vía WebSocket de nuevo pedido pendiente
        List<ItemPedido> items = itemPedidoRepository.findByComandaNumeroComanda(guardado.getComanda().getNumeroComanda());
        wsNotifiaNotificacionService.notificarNuevoPedidoCocina(comandaMapper.toDetalleDTO(guardado.getComanda(), items));

        return guardado;
    }

    @Transactional
    public List<ItemPedido> agregarItemsAComandaBatch(List<ItemPedido> itemsPedido, Integer idUsuario) {
        if (itemsPedido == null || itemsPedido.isEmpty()) return List.of();

        // Procesamos y descontamos stock de todos los items en la misma transacción
        List<ItemPedido> guardados = itemsPedido.stream()
                .map(item -> procesarYGuardarItem(item, idUsuario))
                .collect(Collectors.toList());

        // Notificar a cocina UNA sola vez al final del batch
        Integer numeroComanda = guardados.get(0).getComanda().getNumeroComanda();
        List<ItemPedido> items = itemPedidoRepository.findByComandaNumeroComanda(numeroComanda);
        wsNotifiaNotificacionService.notificarNuevoPedidoCocina(comandaMapper.toDetalleDTO(guardados.get(0).getComanda(), items));

        return guardados;
    }

    private ItemPedido procesarYGuardarItem(ItemPedido itemPedido, Integer idUsuario) {
        // Validación de datos requeridos por contrato antes de romper la base de datos
        if (itemPedido.getPlato() == null || itemPedido.getPlato().getIdPlato() == null) {
            throw new NegocioException(
                    "PLATO_ID_REQUERIDO",
                    "No se puede agregar el ítem a la comanda porque no se especificó un ID de plato válido."
            );
        }

        itemPedido.setEstadoItem(EstadoItem.PENDIENTE);
        ItemPedido guardado = itemPedidoRepository.save(itemPedido);

        // 2. Obtener la receta del plato pedido
        List<Receta> recetas = recetaService.obtenerPorPlato(guardado.getPlato().getIdPlato());
        if (recetas.isEmpty()) {
            throw new NegocioException(
                    "PLATO_SIN_RECETA",
                    "El plato con ID " + guardado.getPlato().getIdPlato() + " no puede ser despachado porque no tiene una receta configurada."
            );
        }

        // 3. Descontar ingredientes de almacén/cocina
        for (Receta receta : recetas) {
            // cantidad requerida en receta * cantidad de platos pedidos por el cliente
            int cantidadADescontar = receta.getCantidad() * guardado.getCantidad();

            // enviamos la cantidad en negativo para que registrarMovimiento realice la resta
            gestorStockFacade.registrarMovimiento(receta.getIngrediente().getIdIngrediente(), -cantidadADescontar, idUsuario);
        }

        return guardado;
    }
}