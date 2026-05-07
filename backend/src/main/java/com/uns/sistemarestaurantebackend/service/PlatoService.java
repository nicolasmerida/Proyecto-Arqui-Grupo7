package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.model.Plato;
import com.uns.sistemarestaurantebackend.repository.PlatoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PlatoService {

    @Autowired
    private PlatoRepository platoRepository;

    public List<Plato> obtenerTodos() {
        return platoRepository.findAll();
    }

    public List<Plato> obtenerActivos() {
        return platoRepository.findByActivo(true);
    }

    public List<Plato> obtenerPorCategoria(Integer idCategoria) {
        return platoRepository.findByCategoriaIdCategoria(idCategoria);
    }

    public Optional<Plato> obtenerPorId(Integer id) {
        return platoRepository.findById(id);
    }

    public Plato guardar(Plato plato) {
        return platoRepository.save(plato);
    }

    public Plato toggleActivo(Integer id) {
        // TODO: validar que no haya ítems pendientes con este plato antes de desactivar
        Plato plato = platoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Plato no encontrado"));
        plato.setActivo(!plato.getActivo());
        return platoRepository.save(plato);
    }

    public void eliminar(Integer id) {
        platoRepository.deleteById(id);
    }
}