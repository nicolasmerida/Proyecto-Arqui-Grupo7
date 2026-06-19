package com.uns.sistemarestaurantebackend.service;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import com.uns.sistemarestaurantebackend.model.Comanda;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class MpService {

    @Value("${mercadopago.access-token}")
    private String accessToken;

    private final ComandaService comandaService;

    public MpService(ComandaService comandaService) {
        this.comandaService = comandaService;
    }
    public String crearPreferencia(Integer idMesa) {
        try {
            MercadoPagoConfig.setAccessToken(accessToken);

            Comanda comandaActiva = comandaService.obtenerPorMesa(idMesa)
                    .orElseThrow(() -> new RuntimeException("No hay comanda"));

            BigDecimal totalMesa = comandaService.calcularTotal(comandaActiva.getNumeroComanda())
                    .setScale(2, RoundingMode.HALF_UP);

            // 1. Definimos las URLs de forma absoluta y limpia
            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success("http://localhost:3000/pago-exitoso")
                    .pending("http://localhost:3000/pago-pendiente")
                    .failure("http://localhost:3000/pago-fallido")
                    .build();

            // 2. Construimos el ítem
            PreferenceItemRequest item = PreferenceItemRequest.builder()
                    .title("Mesa " + idMesa)
                    .quantity(1)
                    .unitPrice(totalMesa)
                    .currencyId("ARS")
                    .build();

            // 3. Construimos la preferencia SIN COMPLICACIONES
            PreferenceRequest request = PreferenceRequest.builder()
                    .items(List.of(item))
                    .backUrls(backUrls)
                    //.autoReturn("approved") TODO: luego del deploy se puede implementar el return success, por ahora no.
                    .externalReference("MESA-" + idMesa)
                    .build();

            // 4. Creamos
            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(request);

            return preference.getInitPoint();

        } catch (MPApiException e) {
            System.out.println("=== ERROR DE MERCADO PAGO API ===");
            System.out.println("Status: " + e.getStatusCode());
            System.out.println("Mensaje: " + e.getMessage());
            System.out.println("Respuesta completa: " + e.getApiResponse().getContent());
            return "Error: " + e.getApiResponse().getContent();
        } catch (MPException e) {
            System.out.println("=== ERROR GENERAL MP ===");
            System.out.println(e.getMessage());
            return "Error: " + e.getMessage();
        }
    }
}