package com.uns.sistemarestaurantebackend.dto.mapper;

import com.uns.sistemarestaurantebackend.dto.IngredienteDTO;
import com.uns.sistemarestaurantebackend.model.Ingrediente;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class IngredienteMapper {

    public IngredienteDTO toDTO(Ingrediente ingrediente) {
        return new IngredienteDTO(
                ingrediente.getIdIngrediente(),
                ingrediente.getNombre(),
                ingrediente.getStock(),
                ingrediente.getStockMinimo(),
                ingrediente.getUnidad()
        );
    }

    public Ingrediente toEntity(IngredienteDTO dto) {
        Ingrediente ingrediente = new Ingrediente();
        ingrediente.setNombre(dto.getNombre());
        ingrediente.setStock(dto.getStock());
        ingrediente.setStockMinimo(dto.getStockMinimo());
        ingrediente.setUnidad(dto.getUnidad());
        return ingrediente;
    }

    public List<IngredienteDTO> toDTOList(List<Ingrediente> ingredientes) {
        return ingredientes.stream().map(this::toDTO).toList();
    }
}