package com.uns.sistemarestaurantebackend.model.converter;

import com.uns.sistemarestaurantebackend.model.enums.EstadoItem;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoItemConverter implements AttributeConverter<EstadoItem, String> {

    @Override
    public String convertToDatabaseColumn(EstadoItem estado) {
        return estado == null ? null : estado.getValor();
    }

    @Override
    public EstadoItem convertToEntityAttribute(String valor) {
        return valor == null ? null : EstadoItem.fromValor(valor);
    }
}
