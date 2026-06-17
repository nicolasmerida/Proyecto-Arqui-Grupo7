package com.uns.sistemarestaurantebackend.dto.mapper;

import com.uns.sistemarestaurantebackend.dto.MovStockDTO;
import com.uns.sistemarestaurantebackend.model.MovStock;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class MovStockMapper {

    public MovStockDTO toDTO(MovStock entity) {
        if (entity == null) {
            return null;
        }

        return MovStockDTO.builder()
                .idMov(entity.getIdMov())
                .nombreIngrediente(entity.getIngrediente() != null ? entity.getIngrediente().getNombre() : null)
                .unidadIngrediente(entity.getIngrediente() != null ? entity.getIngrediente().getUnidad() : null)
                .nombreUsuario(entity.getUsuario() != null ? entity.getUsuario().getNombre() : null)
                .cantidad(entity.getCantidad())
                .fecha(entity.getFecha())
                .build();
    }

    public List<MovStockDTO> toDTOList(List<MovStock> entities) {
        if (entities == null) {
            return null;
        }
        return entities.stream().map(this::toDTO).collect(Collectors.toList());
    }
}
