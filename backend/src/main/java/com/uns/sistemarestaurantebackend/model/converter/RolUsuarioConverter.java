package com.uns.sistemarestaurantebackend.model.converter;

import com.uns.sistemarestaurantebackend.model.enums.RolUsuario;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RolUsuarioConverter implements AttributeConverter<RolUsuario, String> {

    @Override
    public String convertToDatabaseColumn(RolUsuario rol) {
        return rol == null ? null : rol.getValor();
    }

    @Override
    public RolUsuario convertToEntityAttribute(String valor) {
        return valor == null ? null : RolUsuario.fromValor(valor);
    }
}
