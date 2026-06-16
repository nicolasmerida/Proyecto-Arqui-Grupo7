package com.uns.sistemarestaurantebackend.dto.mapper;

import com.uns.sistemarestaurantebackend.dto.PlatoDTO;
import com.uns.sistemarestaurantebackend.model.Plato;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PlatoMapper {

    public PlatoDTO toDTO(Plato plato) {
        return new PlatoDTO(
                plato.getIdPlato(),
                plato.getNombre(),
                plato.getPrecio(),
                plato.getDescripcion(),
                plato.getCategoria() != null ? plato.getCategoria().getNombre() : null,
                plato.getActivo()
        );
    }

    //TODO: Versión correcta si querés mapear la categoría. Necesitás buscar la Categoria desde un service o repository, no desde el mapper solo
    
     public Plato toEntity(PlatoDTO dto) {
        Plato plato = new Plato();
        plato.setIdPlato(dto.getIdPlato());
        plato.setNombre(dto.getNombre());
        plato.setPrecio(dto.getPrecio());
        plato.setDescripcion(dto.getDescripcion());
        plato.setActivo(dto.getActivo());
        return plato;
    }

    public List<PlatoDTO> toDTOList(List<Plato> platos) {
        return platos.stream().map(this::toDTO).toList();
    }
}