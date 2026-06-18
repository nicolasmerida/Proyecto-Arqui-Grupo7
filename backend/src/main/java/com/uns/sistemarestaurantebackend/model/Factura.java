package com.uns.sistemarestaurantebackend.model;

import com.uns.sistemarestaurantebackend.model.converter.MetodoPagoConverter;
import com.uns.sistemarestaurantebackend.model.enums.MetodoPago;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "facturas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idFactura;

    @Column(nullable = false)
    private LocalDateTime fechaHora;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalCobrado;

    @Convert(converter = MetodoPagoConverter.class)
    @Column(nullable = false)
    private MetodoPago metodoPago;

    @Column(name = "payment_id", unique = true)
    private String paymentId; // ID de transacción de Mercado Pago (null si es efectivo)

    // Relación unidireccional con la Mesa y la Comanda para auditoría
    @Column(nullable = false)
    private Integer numeroMesa;

    @Column(nullable = false)
    private Integer numeroComanda;
}