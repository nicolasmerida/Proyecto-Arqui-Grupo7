package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.model.Ingrediente;
import com.uns.sistemarestaurantebackend.model.MovStock;
import com.uns.sistemarestaurantebackend.model.Usuario;
import com.uns.sistemarestaurantebackend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Patrón Facade: Orquesta la lógica completa de actualización de stock.
 * Todos los controladores y servicios deben usar esta clase para alterar el
 * stock.
 */
@Service
public class GestorStockFacade {

    @Autowired
    private IngredienteService ingredienteService;

    @Autowired
    private MovStockService movStockService;

    @Autowired
    private UsuarioRepository usuarioRepository; // Para asociar quién hizo el movimiento

    @Transactional
    public Ingrediente registrarMovimiento(Integer idIngrediente, Integer cantidad, Integer idUsuario) {

        // 1. Actualizar el número físico (Esto ejecuta el Bloqueo Pesimista y valida
        // que no quede en negativo)
        Ingrediente ingrediente = ingredienteService.actualizarStockFisico(idIngrediente, cantidad);

        // 2. Obtener el usuario
        // El ID del usuario nos llega desde Next.js (NextAuth) a través del header X-User-Id.
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseGet(() -> usuarioRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new RuntimeException("Usuario no encontrado (No hay usuarios en la BD)")));

        // 3. Crear y guardar el registro de auditoría
        MovStock movimiento = MovStock.builder()
                .ingrediente(ingrediente)
                .usuario(usuario)
                .cantidad(cantidad)
                .fecha(LocalDateTime.now())
                .build();

        movStockService.registrar(movimiento);

        return ingrediente;
    }
}
