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
import java.util.ArrayList;
import java.util.List;

@Service
public class MpService {

    @Value("${mercadopago.access-token}")
    private String accessToken;

    private final ComandaService comandaService;

    // Inyectamos el servicio de comandas por constructor
    public MpService(ComandaService comandaService) {
        this.comandaService = comandaService;
    }

    public String crearPreferencia(Integer idMesa) {
        try {
            MercadoPagoConfig.setAccessToken(accessToken);

            // 1. Buscamos la comanda ACTIVA de esa mesa (la que no está ni cerrada ni cancelada)
            Comanda comandaActiva = comandaService.obtenerPorMesa(idMesa)
                    .orElseThrow(() -> new RuntimeException("No hay una comanda activa para la mesa " + idMesa));

            // 2. Usamos TU función para calcular el total exacto de la base de datos
            BigDecimal totalMesa = comandaService.calcularTotal(comandaActiva.getNumeroComanda());

            // Validación: No se puede cobrar $0
            if (totalMesa.compareTo(BigDecimal.ZERO) <= 0) {
                return "Error: El total de la mesa debe ser mayor a $0 para poder cobrar.";
            }

            PreferenceClient client = new PreferenceClient();

            // 3. Armamos el ítem dinámico
            PreferenceItemRequest item = PreferenceItemRequest.builder()
                    .title("Consumo Mesa #" + idMesa)
                    .quantity(1)
                    .unitPrice(totalMesa)
                    .currencyId("ARS")
                    .build();

            List<PreferenceItemRequest> items = new ArrayList<>();
            items.add(item);

            // 4. TRUCO CLAVE: Le pasamos el idMesa en la URL de éxito.
            // Mercado Pago le va a agregar automáticamente "&payment_id=XXX&status=approved" al final de esta URL.
            PreferenceRequest request = PreferenceRequest.builder()
                    .items(items)
                    .backUrls(PreferenceBackUrlsRequest.builder()
                            .success("http://localhost:3000/pago-exitoso?mesa=" + idMesa)
                            .pending("http://localhost:3000/pago-pendiente")
                            .failure("http://localhost:3000/pago-fallido")
                            .build())
                    .autoReturn("approved") // Fuerza a que MP redirija solo al usuario si el pago es exitoso
                    .build();

            Preference preference = client.create(request);

            return preference.getInitPoint();

        } catch (MPException | MPApiException e) {
            System.out.println("Error de Mercado Pago: " + e.getMessage());
            return "Error al crear el link de pago";
        }
    }
}