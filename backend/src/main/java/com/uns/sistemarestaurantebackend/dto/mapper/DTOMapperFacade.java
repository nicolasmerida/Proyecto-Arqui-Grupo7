package com.uns.sistemarestaurantebackend.dto.mapper;

import org.springframework.stereotype.Component;

import com.uns.sistemarestaurantebackend.dto.IngredienteDTO;
import com.uns.sistemarestaurantebackend.dto.MesaDTO;
import com.uns.sistemarestaurantebackend.dto.ItemPedidoDTO;
import com.uns.sistemarestaurantebackend.dto.PlatoDTO;
import com.uns.sistemarestaurantebackend.dto.ComandaDTO;

import com.uns.sistemarestaurantebackend.model.Comanda;
import com.uns.sistemarestaurantebackend.model.Ingrediente;
import com.uns.sistemarestaurantebackend.model.ItemPedido;
import com.uns.sistemarestaurantebackend.model.Mesa;

@Component
public class DTOMapperFacade {

    private final IngredienteMapper  ingredienteMapper;
    private final ItemPedidoMapper itemPedidoMapper;
    private final ComandaMapper    comandaMapper;
    private final MesaMapper       mesaMapper;

    public DTOMapperFacade(IngredienteMapper ingredienteMapper,
                          ItemPedidoMapper itemPedidoMapper,
                          ComandaMapper comandaMapper,
                          MesaMapper mesaMapper) {

        this.ingredienteMapper  = ingredienteMapper;
        this.itemPedidoMapper = itemPedidoMapper;
        this.comandaMapper    = comandaMapper;
        this.mesaMapper       = mesaMapper;
    }

    public IngredienteDTO     toStockDto(Ingrediente i)  { return ingredienteMapper.toDTO(i); }
    public ItemPedidoDTO    toItemDto(ItemPedido item) { return itemPedidoMapper.toDTO(item); }
    public ComandaDTO toComandaDto(Comanda c)    { return comandaMapper.toDTO(c); }
    public MesaDTO    toMesaDto(Mesa m)          { return mesaMapper.toDTO(m); }
}

