package com.uns.sistemarestaurantebackend.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum EstadoMesa {
    LIBRE("Libre"),
    OCUPADA("Ocupada"),
    RESERVADA("Reservada");

    private final String valor;

    EstadoMesa(String valor) { this.valor = valor; }

    public String getValor() { return valor; }

    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    public static EstadoMesa fromValor(String valor) {
        for (EstadoMesa e : values()) {
            if (e.valor.equalsIgnoreCase(valor) || e.name().equalsIgnoreCase(valor)) {
                return e;
            }
        }
        throw new IllegalArgumentException("EstadoMesa desconocido: " + valor);
    }
}