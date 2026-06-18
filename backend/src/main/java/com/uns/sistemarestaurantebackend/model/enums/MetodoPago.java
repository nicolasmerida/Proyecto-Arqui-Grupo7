package com.uns.sistemarestaurantebackend.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum MetodoPago {
    MERCADO_PAGO("Mercado Pago"),
    EFECTIVO("Efectivo");

    private final String valor;

    MetodoPago(String valor) {
        this.valor = valor;
    }

    public String getValor() {
        return valor;
    }

    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    public static MetodoPago fromValor(String valor) {
        for (MetodoPago e : values()) {
            if (e.valor.equalsIgnoreCase(valor) || e.name().equalsIgnoreCase(valor)) {
                return e;
            }
        }
        throw new IllegalArgumentException("MetodoPago desconocido: " + valor);
    }
}