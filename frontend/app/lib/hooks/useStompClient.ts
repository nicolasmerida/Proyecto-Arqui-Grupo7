'use client';

import { useEffect, useRef, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * Custom hook para conectarse al WebSocket del backend vía STOMP/SockJS
 * y suscribirse a un tópico específico.
 * 
 * @param topic Tópico al cual suscribirse (ej. '/topic/comanda')
 * @param onMessageReceived Callback que se ejecuta al recibir un mensaje
 */
export function useStompClient<T>(topic: string, onMessageReceived: (message: T) => void) {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const client = new Client({
      // Usamos factory con SockJS dado que el backend expone .withSockJS() en '/api/ws'
      webSocketFactory: () => new SockJS(`${BACKEND_URL}/api/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log(`[STOMP] Conectado. Suscribiendo a ${topic}`);
        setConnected(true);

        client.subscribe(topic, (msg: IMessage) => {
          if (msg.body) {
            const body = JSON.parse(msg.body) as T;
            onMessageReceived(body);
          }
        });
      },
      onDisconnect: () => {
        console.log('[STOMP] Desconectado');
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error('[STOMP] Broker error: ' + frame.headers['message']);
        console.error('[STOMP] Details: ' + frame.body);
      },
      // Desactivamos logs muy verbosos en consola por defecto
      debug: (str) => {
        // console.log(str); 
      }
    });

    client.activate();
    clientRef.current = client;

    // Cleanup al desmontar
    return () => {
      client.deactivate();
    };
  }, [topic, onMessageReceived]);

  return { connected };
}
