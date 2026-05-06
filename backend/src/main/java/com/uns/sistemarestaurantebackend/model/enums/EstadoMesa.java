package com.uns.sistemarestaurantebackend.model.enums;

public enum EstadoMesa {
    LIBRE("Libre"),
    OCUPADA("Ocupada"),
    RESERVADA("Reservada");

    private final String valor;

    EstadoMesa(String valor) { this.valor = valor; }

    public String getValor() { return valor; }

    public static EstadoMesa fromValor(String valor) {
        for (EstadoMesa e : values()) {
            if (e.valor.equals(valor)) return e;
        }
        throw new IllegalArgumentException("EstadoMesa desconocido: " + valor);
    }
}
