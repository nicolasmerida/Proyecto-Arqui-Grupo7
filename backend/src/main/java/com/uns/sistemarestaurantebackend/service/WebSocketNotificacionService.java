// WebSocketNotificacionService.java
package com.uns.sistemarestaurantebackend.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.uns.sistemarestaurantebackend.model.Comanda;
import com.uns.sistemarestaurantebackend.model.Ingrediente;
import com.uns.sistemarestaurantebackend.model.ItemPedido;
import com.uns.sistemarestaurantebackend.model.Mesa;


@Service
public class WebSocketNotificacionService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketNotificacionService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
    
    public void notificarCambioEstadoComanda(Integer comandaId, String nuevoEstado) {
        String destino = "/topic/comandas/" + comandaId + "/estado";
        messagingTemplate.convertAndSend(destino, nuevoEstado);
    }

    public void notificarNuevoPedidoCocina(Comanda comanda) {
        messagingTemplate.convertAndSend("/topic/cocina/nuevo-pedido", comanda);
    }

    public void notificarItemListo(ItemPedido item) {
        messagingTemplate.convertAndSend("/topic/items/listo", item);
    }

    public void notificarCambioSalon(Mesa mesaGuardada) {
        messagingTemplate.convertAndSend("/topic/salon/actualizacion", mesaGuardada);
    }

    public void notificarAlertaStock(Ingrediente ingrediente) {
        messagingTemplate.convertAndSend("/topic/alertas/stock", ingrediente);
    }

}