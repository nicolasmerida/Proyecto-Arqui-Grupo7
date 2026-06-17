package com.uns.sistemarestaurantebackend.dto.mapper;

import java.util.List;

import org.springframework.stereotype.Component;
import com.uns.sistemarestaurantebackend.dto.ComandaDTO;
import com.uns.sistemarestaurantebackend.model.Comanda;


@Component
public class ComandaMapper {

    public ComandaDTO toDTO(Comanda comanda) {
        return new ComandaDTO(
                comanda.getNumeroComanda(),
                comanda.getEstadoComanda().name()
        );
    }

    public List<ComandaDTO> toDTOList(List<Comanda> comandas) {
        return comandas.stream()
                .map(c -> toDTO(c))
                .toList();
    }
}