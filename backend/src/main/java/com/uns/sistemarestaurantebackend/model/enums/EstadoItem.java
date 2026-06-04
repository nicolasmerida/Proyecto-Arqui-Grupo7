package com.uns.sistemarestaurantebackend.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

// Maquina de estados (HU doc pag 4):
// Pendiente -> Cancelado | En preparacion -> Listo -> Entregado
public enum EstadoItem {
    PENDIENTE("Pendiente"),
    EN_PREPARACION("En preparacion"),
    LISTO("Listo"),
    ENTREGADO("Entregado"),
    CANCELADO("Cancelado");

    private final String valor;

    EstadoItem(String valor) { this.valor = valor; }

    public String getValor() { return valor; }

    @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
    public static EstadoItem fromValor(String valor) {
        for (EstadoItem e : values()) {
            if (e.valor.equalsIgnoreCase(valor) || e.name().equalsIgnoreCase(valor)) {
                return e;
            }
        }
        throw new IllegalArgumentException("EstadoItem desconocido: " + valor);
    }
}


/*package com.uns.sistemarestaurantebackend.model.enums;
import com.fasterxml.jackson.annotation.JsonCreator;

// Maquina de estados (HU doc pag 4):
// Pendiente -> Cancelado | En preparacion -> Listo -> Entregado
@JsonCreator
public enum EstadoItem {
    PENDIENTE("Pendiente"),
    EN_PREPARACION("En preparacion"),
    LISTO("Listo"),
    ENTREGADO("Entregado"),
    CANCELADO("Cancelado");

    private final String valor;

    EstadoItem(String valor) { this.valor = valor; }

    public String getValor() { return valor; }

    public static EstadoItem fromValor(String valor) {
        for (EstadoItem e : values()) {
            if (e.valor.equals(valor)) return e;
        }
        throw new IllegalArgumentException("EstadoItem desconocido: " + valor);
    }
}
*/