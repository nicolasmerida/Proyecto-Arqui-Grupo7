package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.exception.NegocioException;
import com.uns.sistemarestaurantebackend.exception.RecursoNoEncontradoException;
import com.uns.sistemarestaurantebackend.model.Ingrediente;
import com.uns.sistemarestaurantebackend.repository.IngredienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class IngredienteService {

    // Inyección por constructor (adiós @Autowired)
    private final IngredienteRepository ingredienteRepository;

    public IngredienteService(IngredienteRepository ingredienteRepository) {
        this.ingredienteRepository = ingredienteRepository;
    }

    public List<Ingrediente> obtenerTodos() {
        return ingredienteRepository.findAll();
    }

    // Ya no devuelve Optional, devuelve el objeto o hace saltar nuestra red de contención
    public Ingrediente obtenerPorId(Integer id) {
        return ingredienteRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "INGREDIENTE_NO_ENCONTRADO",
                        "El ingrediente con ID " + id + " no existe."
                ));
    }

    public List<Ingrediente> obtenerBajoStock() {
        return ingredienteRepository.findIngredientesBajoMinimo();
    }

    public Ingrediente guardar(Ingrediente ingrediente) {
        return ingredienteRepository.save(ingrediente);
    }

    /* * ATENCIÓN (Convención de Equipo): Este método es package-private intencionalmente.
     * NO SE DEBE LLAMAR DIRECTAMENTE DESDE OTROS MÓDULOS.
     * Utilizar GestorStockFacade.registrarMovimiento() para asegurar la auditoría.
     */
    @Transactional
    Ingrediente actualizarStockFisico(Integer id, Integer cantidad) {
        // Mismo trato: si falla el pesimista, tiramos RecursoNoEncontradoException
        Ingrediente ingrediente = ingredienteRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "INGREDIENTE_NO_ENCONTRADO",
                        "No se puede actualizar el stock porque el ingrediente con ID " + id + " no existe."
                ));

        int nuevoStock = ingrediente.getStock() + cantidad;

        // HU-11: Validar stock suficiente usando nuestra excepción de negocio
        if (nuevoStock < 0) {
            throw new NegocioException(
                    "STOCK_INSUFICIENTE",
                    "Stock insuficiente para: " + ingrediente.getNombre() + ". Se intentó retirar " + Math.abs(cantidad) + " pero solo hay " + ingrediente.getStock() + " disponibles."
            );
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
        // Validamos primero para evitar el Error 500
        if (!ingredienteRepository.existsById(id)) {
            throw new RecursoNoEncontradoException(
                    "INGREDIENTE_NO_ENCONTRADO",
                    "No se puede eliminar porque el ingrediente con ID " + id + " no existe."
            );
        }
        ingredienteRepository.deleteById(id);
    }
}