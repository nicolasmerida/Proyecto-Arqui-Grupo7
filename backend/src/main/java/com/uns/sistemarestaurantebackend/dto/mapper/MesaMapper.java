package com.uns.sistemarestaurantebackend.dto.mapper;

import com.uns.sistemarestaurantebackend.dto.MesaDTO;
import com.uns.sistemarestaurantebackend.model.Mesa;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MesaMapper {

    public MesaDTO toDTO(Mesa mesa) {
        return new MesaDTO(
                mesa.getNumeroMesa(),
                mesa.getCapacidad(),
                mesa.getSector(),
                mesa.getEstadoMesa(),
                mesa.getHoraDeApertura()
        );
    }

    public Mesa toEntity(MesaDTO dto) {
        Mesa mesa = new Mesa();
        mesa.setNumeroMesa(dto.getNumeroMesa());
        mesa.setCapacidad(dto.getCapacidad());
        mesa.setSector(dto.getSector());
        mesa.setEstadoMesa(dto.getEstadoMesa());
        mesa.setHoraDeApertura(dto.getHoraDeApertura());
        return mesa;
    }

    public List<MesaDTO> toDTOList(List<Mesa> mesas) {
        return mesas.stream().map(this::toDTO).toList();
    }
}