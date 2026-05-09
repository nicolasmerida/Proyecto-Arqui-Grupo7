package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.model.Ingrediente;
import com.uns.sistemarestaurantebackend.repository.IngredienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class IngredienteService {

    @Autowired
    private IngredienteRepository ingredienteRepository;

    public List<Ingrediente> obtenerTodos() {
        return ingredienteRepository.findAll();
    }

    public Optional<Ingrediente> obtenerPorId(Integer id) {
        return ingredienteRepository.findById(id);
    }

    public List<Ingrediente> obtenerBajoStock() {
        // TODO: filtrar ingredientes donde stock <= stock_minimo
        return ingredienteRepository.findIngredientesBajoMinimo();
    }

    public Ingrediente guardar(Ingrediente ingrediente) {
        return ingredienteRepository.save(ingrediente);
    }

    public Ingrediente actualizarStock(Integer id, Integer cantidad) {
        // TODO: validar stock suficiente si cantidad es negativa
        // TODO: generar MovimientoStock automáticamente
        Ingrediente ingrediente = ingredienteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ingrediente no encontrado"));
        ingrediente.setStock(ingrediente.getStock() + cantidad);
        return ingredienteRepository.save(ingrediente);
    }

    public void eliminar(Integer id) {
        ingredienteRepository.deleteById(id);
    }
}