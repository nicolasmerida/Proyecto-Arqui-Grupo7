package com.uns.sistemarestaurantebackend.repository;

import com.uns.sistemarestaurantebackend.model.Usuario;
import com.uns.sistemarestaurantebackend.model.enums.RolUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    // Autenticacion: buscar usuario por email para validar credenciales
    Optional<Usuario> findByEmail(String email);

    // Verificar email unico antes de crear usuario
    boolean existsByEmail(String email);

    // Filtrar personal por rol (ej: listar todos los mozos)
    List<Usuario> findByRol(RolUsuario rol);
}
