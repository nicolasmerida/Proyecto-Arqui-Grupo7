package com.uns.sistemarestaurantebackend.dto.mapper;

import com.uns.sistemarestaurantebackend.dto.PlatoDTO;
import com.uns.sistemarestaurantebackend.model.Plato;
import com.uns.sistemarestaurantebackend.repository.CategoriaRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PlatoMapper {

    private final CategoriaRepository categoriaRepository;

    public PlatoMapper(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

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
    
     public Plato toEntity(PlatoDTO dto) {
        Plato plato = new Plato();
        plato.setIdPlato(dto.getIdPlato());
        plato.setNombre(dto.getNombre());
        plato.setPrecio(dto.getPrecio());
        plato.setDescripcion(dto.getDescripcion());
        plato.setActivo(dto.getActivo());
        
        if (dto.getCategoria() != null) {
            categoriaRepository.findAll().stream()
                .filter(c -> c.getNombre().equalsIgnoreCase(dto.getCategoria()))
                .findFirst()
                .ifPresent(plato::setCategoria);
        }
        
        return plato;
    }

    public List<PlatoDTO> toDTOList(List<Plato> platos) {
        return platos.stream().map(this::toDTO).toList();
    }
}