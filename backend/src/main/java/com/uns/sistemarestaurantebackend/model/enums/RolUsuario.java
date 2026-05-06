package com.uns.sistemarestaurantebackend.model.enums;

public enum RolUsuario {
    ADMINISTRADOR("Administrador"),
    MOZO("Mozo"),
    COCINERO("Cocinero");

    private final String valor;

    RolUsuario(String valor) { this.valor = valor; }

    public String getValor() { return valor; }

    public static RolUsuario fromValor(String valor) {
        for (RolUsuario e : values()) {
            if (e.valor.equals(valor)) return e;
        }
        throw new IllegalArgumentException("RolUsuario desconocido: " + valor);
    }
}
