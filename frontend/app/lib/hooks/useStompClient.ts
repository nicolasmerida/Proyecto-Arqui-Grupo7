'use client';

import { useEffect, useRef, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export function useStompClient<T>(topic: string, onMessageReceived: (message: T) => void) {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);
  // Guardamos siempre la última versión del callback en un ref
  const callbackRef = useRef(onMessageReceived);

  useEffect(() => {
    callbackRef.current = onMessageReceived;
  }, [onMessageReceived]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${BACKEND_URL}/api/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log(`[STOMP] Conectado. Suscribiendo a ${topic}`);
        setConnected(true);

        client.subscribe(topic, (msg: IMessage) => {
          if (msg.body) {
            const body = JSON.parse(msg.body) as T;
            // Usamos el ref, siempre apunta al callback más reciente
            callbackRef.current(body);
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
      debug: () => {},
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [topic]); // <-- solo se reconecta si cambia el tópico

  return { connected };
}