package com.uns.sistemarestaurantebackend.dto.mapper;

import com.uns.sistemarestaurantebackend.dto.IngredienteDTO;
import com.uns.sistemarestaurantebackend.dto.RecetaDTO;
import com.uns.sistemarestaurantebackend.model.Ingrediente;
import com.uns.sistemarestaurantebackend.model.Receta;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RecetaMapper {

    public RecetaDTO toDTO(Receta receta) {
        Ingrediente ing = receta.getIngrediente();
        IngredienteDTO ingDTO = new IngredienteDTO(
                ing.getIdIngrediente(),
                ing.getNombre(),
                ing.getStock(),
                ing.getStockMinimo(),
                ing.getUnidad()
        );

        return new RecetaDTO(
                receta.getPlato() != null ? receta.getPlato().getIdPlato() : null,
                ingDTO,
                receta.getCantidad()
        );
    }

    public List<RecetaDTO> toDTOList(List<Receta> recetas) {
        return recetas.stream().map(this::toDTO).collect(Collectors.toList());
    }
}
