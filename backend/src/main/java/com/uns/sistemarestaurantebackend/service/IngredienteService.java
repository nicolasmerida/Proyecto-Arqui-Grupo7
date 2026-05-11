package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.model.Ingrediente;
import com.uns.sistemarestaurantebackend.repository.IngredienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

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
        return ingredienteRepository.findIngredientesBajoMinimo();
    }

    public Ingrediente guardar(Ingrediente ingrediente) {
        return ingredienteRepository.save(ingrediente);
    }

    /* 
     * ATENCIÓN (Convención de Equipo): Este método es package-private intencionalmente. 
     * NO SE DEBE LLAMAR DIRECTAMENTE DESDE OTROS MÓDULOS. 
     * Utilizar GestorStockFacade.registrarMovimiento() para asegurar la auditoría.
     */
    @Transactional
    Ingrediente actualizarStockFisico(Integer id, Integer cantidad) {
        // Usamos el método con Bloqueo Pesimista (FOR UPDATE)
        Ingrediente ingrediente = ingredienteRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new RuntimeException("Ingrediente no encontrado"));

        int nuevoStock = ingrediente.getStock() + cantidad;

        // HU-11: Validar stock suficiente
        if (nuevoStock < 0) {
            throw new IllegalStateException("Stock insuficiente para: " + ingrediente.getNombre());
        }

        ingrediente.setStock(nuevoStock);

        // Evaluar alerta de umbral
        if (ingrediente.estaBajoMinimo()) {
            System.out.println("ALERTA: Ingrediente " + ingrediente.getNombre() + " por debajo del mínimo!");
            // TODO: Notificar por email o WebSocket a Admin/Cocinero
        }

        return ingredienteRepository.save(ingrediente);
    }

    public void eliminar(Integer id) {
        ingredienteRepository.deleteById(id);
    }
}