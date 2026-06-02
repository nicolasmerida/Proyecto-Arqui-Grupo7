package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.model.MovStock;
import com.uns.sistemarestaurantebackend.repository.MovStockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MovStockService {

    @Autowired
    private MovStockRepository movStockRepository;

    public List<MovStock> obtenerPorIngrediente(Integer idIngrediente) {
        return movStockRepository.findByIngredienteIdIngrediente(idIngrediente);
    }

    public List<MovStock> obtenerPorUsuario(Integer idUsuario) {
        return movStockRepository.findByUsuarioIdUsuario(idUsuario);
    }

    public MovStock registrar(MovStock movimiento) {
        return movStockRepository.save(movimiento);
    }
}