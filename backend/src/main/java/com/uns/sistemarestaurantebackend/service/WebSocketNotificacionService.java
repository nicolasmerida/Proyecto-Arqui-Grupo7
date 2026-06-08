// WebSocketNotificacionService.java
package com.uns.sistemarestaurantebackend.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;


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

     //TODO: revisar si esta bien implementado y definir correctamente el resto de los topics

}