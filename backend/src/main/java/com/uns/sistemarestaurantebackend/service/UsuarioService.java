package com.uns.sistemarestaurantebackend.service;

import com.uns.sistemarestaurantebackend.exception.RecursoNoEncontradoException;
import com.uns.sistemarestaurantebackend.model.Usuario;
import com.uns.sistemarestaurantebackend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    // Inyección por constructor
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    // Centralizamos el 404 aquí
    public Usuario obtenerPorId(Integer id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "USUARIO_NO_ENCONTRADO",
                        "El usuario con ID " + id + " no existe."
                ));
    }

    // Nota: Dejamos esto por si lo necesitas para el login o validaciones futuras
    public Usuario obtenerPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RecursoNoEncontradoException(
                        "USUARIO_NO_ENCONTRADO",
                        "El usuario con email " + email + " no existe."
                ));
    }

    public Usuario guardar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // Lógica de actualización centralizada
    public Usuario actualizar(Integer id, Usuario usuarioActualizado) {
        obtenerPorId(id); // Valida que exista, si no tira 404
        usuarioActualizado.setIdUsuario(id);
        return usuarioRepository.save(usuarioActualizado);
    }

    public void eliminar(Integer id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RecursoNoEncontradoException(
                    "USUARIO_NO_ENCONTRADO",
                    "No se puede eliminar el usuario con ID " + id + " porque no existe."
            );
        }
        usuarioRepository.deleteById(id);
    }
}