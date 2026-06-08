package com.uns.sistemarestaurantebackend.exception;

public class NegocioException extends RuntimeException {
    private final String code;
    private final String details; // Agregamos el campo

    // Constructor 1: Cuando NO tenemos detalles (pasa null por defecto)
    public NegocioException(String code, String message) {
        super(message);
        this.code = code;
        this.details = null;
    }

    // Constructor 2: Cuando SÍ queremos mandar detalles extra
    public NegocioException(String code, String message, String details) {
        super(message);
        this.code = code;
        this.details = details;
    }

    public String getCode() { return code; }
    public String getDetails() { return details; }
}