package com.uns.sistemarestaurantebackend.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum RolUsuario {
    // Valores en minúsculas para coincidir exactamente con la base de datos Neon
    ADMINISTRADOR("administrador"),
    MOZO("mozo"),
    COCINERO("cocinero");

    private final String valor;

    RolUsuario(String valor) { this.valor = valor; }

    public String getValor() { return valor; }

    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    public static RolUsuario fromValor(String valor) {
        for (RolUsuario e : values()) {
            if (e.valor.equalsIgnoreCase(valor) || e.name().equalsIgnoreCase(valor)) {
                return e;
            }
        }
        throw new IllegalArgumentException("RolUsuario desconocido: " + valor);
    }
}

/*package com.uns.sistemarestaurantebackend.model.enums;

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
*/