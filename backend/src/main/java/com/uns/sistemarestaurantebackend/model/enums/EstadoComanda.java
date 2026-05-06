package com.uns.sistemarestaurantebackend.model.enums;

// Maquina de estados (HU doc pag 4):
// Abierta -> Cancelada | En preparacion -> Lista -> Entregada -> Cerrada
public enum EstadoComanda {
    ABIERTA("Abierta"),
    CANCELADA("Cancelada"),
    EN_PREPARACION("En preparacion"),
    LISTA("Lista"),
    ENTREGADA("Entregada"),
    CERRADA("Cerrada");

    private final String valor;

    EstadoComanda(String valor) { this.valor = valor; }

    public String getValor() { return valor; }

    public static EstadoComanda fromValor(String valor) {
        for (EstadoComanda e : values()) {
            if (e.valor.equals(valor)) return e;
        }
        throw new IllegalArgumentException("EstadoComanda desconocido: " + valor);
    }
}
