package com.uns.sistemarestaurantebackend.model.converter;

import com.uns.sistemarestaurantebackend.model.enums.MetodoPago;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class MetodoPagoConverter implements AttributeConverter<MetodoPago, String> {

    @Override
    public String convertToDatabaseColumn(MetodoPago atributo) {
        if (atributo == null) {
            return null;
        }
        return atributo.getValor();
    }

    @Override
    public MetodoPago convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return MetodoPago.fromValor(dbData);
    }
}