package com.uns.sistemarestaurantebackend.repository;

import com.uns.sistemarestaurantebackend.model.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Integer> {
}