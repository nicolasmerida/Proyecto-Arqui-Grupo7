package com.uns.sistemarestaurantebackend.model;

import com.uns.sistemarestaurantebackend.model.enums.RolUsuario;
import jakarta.persistence.*;
import lombok.*;

// Puede ser Mozo, Cocinero o Administrador
@Entity
@Table(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    // CORRECCION 1: faltaba @Column(name="id_usuario")
    // Hibernate buscaba columna "id" en la DB, que no existe -> app no arrancaba
    // CORRECCION 2: el campo se llama idUsuario (no "id") para ser consistente con la DB
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(nullable = false, length = 25)
    private String nombre;

    @Column(nullable = false, unique = true, columnDefinition = "TEXT")
    private String email;

    // Se almacena el hash, nunca el password en texto plano
    @Column(nullable = false, columnDefinition = "TEXT")
    private String password;

    // CORRECCION 3: era "Rol" con @Enumerated(STRING) -> guardaba "MOZO" pero la DB
    // tiene CHECK con 'Mozo' -> todos los inserts fallaban por constraint violation
    // Ahora usa RolUsuario + RolUsuarioConverter (autoApply) que traduce correctamente
    @Column(nullable = false, length = 15)
    private RolUsuario rol;
}
