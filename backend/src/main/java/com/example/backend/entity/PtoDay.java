package com.example.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "pto_days")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PtoDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "PTO date is required")
    @Column(nullable = false)
    private LocalDate ptoDate;

    @NotNull(message = "Submitted date is required")
    @Column(nullable = false)
    private LocalDate submittedOn;

    @NotNull(message = "Reason is required")
    @Size(max = 500, message = "Reason must not exceed 500 characters")
    @Column(nullable = false, length = 500)
    private String reason;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PtoStatus statuss;

    public enum PtoStatus {
        Pending, Approved, Rejected
    }
}
