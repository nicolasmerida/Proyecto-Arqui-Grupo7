package com.uns.sistemarestaurantebackend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Maneja Reglas de Negocio (Ej: Capacidad excedida) -> Devuelve 400 Bad Request
    @ExceptionHandler(NegocioException.class)
    public ResponseEntity<Object> handleNegocioException(NegocioException ex) {
        // CORREGIDO: Ahora usa ex.getDetails() en lugar de null
        return construirRespuesta(ex.getCode(), ex.getMessage(), ex.getDetails(), HttpStatus.BAD_REQUEST);
    }

    // 2. Maneja Recursos Inexistentes (Ej: Mesa no existe) -> Devuelve 404 Not Found
    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<Object> handleRecursoNoEncontradoException(RecursoNoEncontradoException ex) {
        // CORREGIDO: Ahora usa ex.getDetails() en lugar de null
        return construirRespuesta(ex.getCode(), ex.getMessage(), ex.getDetails(), HttpStatus.NOT_FOUND);
    }

    // 3. Atrapa-Todo para errores de servidor inesperados -> Devuelve 500 Internal Server Error
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleExcepcionGeneral(Exception ex) {
        return construirRespuesta("ERROR_INTERNO_SERVIDOR", "Ocurrió un error inesperado.", ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Constructor unificado para que todos los JSON salgan idénticos
    private ResponseEntity<Object> construirRespuesta(String code, String message, String details, HttpStatus status) {
        Map<String, Object> errorInnerBody = new LinkedHashMap<>();
        errorInnerBody.put("code", code);
        errorInnerBody.put("message", message);
        errorInnerBody.put("details", details);

        Map<String, Object> mainBody = new LinkedHashMap<>();
        mainBody.put("error", errorInnerBody);

        return new ResponseEntity<>(mainBody, status);
    }
}