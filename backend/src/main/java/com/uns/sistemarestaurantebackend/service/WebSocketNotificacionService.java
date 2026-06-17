// WebSocketNotificacionService.java
package com.uns.sistemarestaurantebackend.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.uns.sistemarestaurantebackend.dto.ComandaResumenDTO;
import com.uns.sistemarestaurantebackend.dto.ComandaDetalleDTO;
import com.uns.sistemarestaurantebackend.dto.IngredienteAlertaDTO;
import com.uns.sistemarestaurantebackend.dto.ItemPedidoDTO;
import com.uns.sistemarestaurantebackend.dto.MesaDTO;

@Service
public class WebSocketNotificacionService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketNotificacionService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    //  HU-06: Cocinero recibe nuevo ítem pendiente de preparar
    public void notificarNuevoPedidoCocina(ComandaDetalleDTO comandaDetalle) {
        messagingTemplate.convertAndSend("/topic/cocina", comandaDetalle);
    }

    // HU-07: Mozo recibe aviso de que un ítem está listo para retirar
    public void notificarItemListo(ItemPedidoDTO item) {
        messagingTemplate.convertAndSend("/topic/mozo", item);
    }

    // HU-11/12: Admin recibe alerta cuando un ingrediente cae bajo el mínimo
    public void notificarAlertaStock(IngredienteAlertaDTO alerta) {
        messagingTemplate.convertAndSend("/topic/admin/stock", alerta);
    }

    // Cambios en la comanda, ver correctamente que topic usar
    public void notificarCambioEstadoComanda(ComandaResumenDTO comandaResumen) {
        messagingTemplate.convertAndSend("/topic/comanda", comandaResumen);
    }

    // Cambios en el salon
    public void notificarCambioSalon(MesaDTO mesa) {
        messagingTemplate.convertAndSend("/topic/mesa", mesa);
    }
}
