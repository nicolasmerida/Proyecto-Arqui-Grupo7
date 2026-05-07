package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.model.Receta;
import com.uns.sistemarestaurantebackend.repository.RecetaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RecetaService {

    @Autowired
    private RecetaRepository recetaRepository;

    public List<Receta> obtenerPorPlato(Integer idPlato) {
        return recetaRepository.findByPlatoIdPlato(idPlato);
    }

    public Receta guardar(Receta receta) {
        return recetaRepository.save(receta);
    }

    public void eliminar(Receta.RecetaId id) {
        recetaRepository.deleteById(id);
    }
}