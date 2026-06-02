package com.uns.sistemarestaurantebackend.model.converter;

import com.uns.sistemarestaurantebackend.model.enums.EstadoMesa;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoMesaConverter implements AttributeConverter<EstadoMesa, String> {

    @Override
    public String convertToDatabaseColumn(EstadoMesa estado) {
        return estado == null ? null : estado.getValor();
    }

    @Override
    public EstadoMesa convertToEntityAttribute(String valor) {
        return valor == null ? null : EstadoMesa.fromValor(valor);
    }
}
