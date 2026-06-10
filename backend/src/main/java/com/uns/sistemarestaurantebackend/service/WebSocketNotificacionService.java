// WebSocketNotificacionService.java
package com.uns.sistemarestaurantebackend.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.uns.sistemarestaurantebackend.model.Ingrediente;
import com.uns.sistemarestaurantebackend.model.ItemPedido;
import com.uns.sistemarestaurantebackend.model.Comanda;
import com.uns.sistemarestaurantebackend.model.Mesa;

@Service
public class WebSocketNotificacionService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketNotificacionService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // HU-06: Cocinero recibe nuevo ítem pendiente de preparar
    public void notificarNuevoPedidoCocina(ItemPedido item) {
        messagingTemplate.convertAndSend("/topic/cocina", item);
    }

    // HU-07: Mozo recibe aviso de que un ítem está listo para retirar
    public void notificarItemListo(ItemPedido item) {
        messagingTemplate.convertAndSend("/topic/mozo", item);
    }

    // HU-11/12: Admin recibe alerta cuando un ingrediente cae bajo el mínimo
    public void notificarAlertaStock(Ingrediente ingrediente) {
        messagingTemplate.convertAndSend("/topic/admin/stock", ingrediente);
    }

    // Cambios en la comanda, ver correctamente que topic usar
    public void notificarCambioEstadoComanda(Comanda comanda) {
        messagingTemplate.convertAndSend("/topic/comanda", comanda);
    }

    //Cambios en el salon
    public void notificarCambioSalon(Mesa mesa) {
        messagingTemplate.convertAndSend("/topic/mesa", mesa);
    }
}

    //TODO: definir correctamente los metodos para reducir el payload con DTO'S:
    /*Ejemplo: 

        Map<String, Object> payload = Map.of(
        "ingrediente", nombreIngrediente,
        "stockActual", stockActual
    );
    messagingTemplate.convertAndSend("/topic/alertas/stock", payload);
     */
