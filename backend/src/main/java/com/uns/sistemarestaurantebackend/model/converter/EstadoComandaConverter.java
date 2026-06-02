package com.uns.sistemarestaurantebackend.model.converter;

import com.uns.sistemarestaurantebackend.model.enums.EstadoComanda;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoComandaConverter implements AttributeConverter<EstadoComanda, String> {

    @Override
    public String convertToDatabaseColumn(EstadoComanda estado) {
        return estado == null ? null : estado.getValor();
    }

    @Override
    public EstadoComanda convertToEntityAttribute(String valor) {
        return valor == null ? null : EstadoComanda.fromValor(valor);
    }
}
