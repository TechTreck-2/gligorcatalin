package com.example.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "time_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Date is required")
    @Column(nullable = false)
    private LocalDate date;

    @NotNull(message = "Type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private EntryType type;

    @Size(max = 20, message = "Start time must not exceed 20 characters")
    @Column(length = 20)
    private String startTime;

    @Size(max = 20, message = "End time must not exceed 20 characters")
    @Column(length = 20)
    private String endTime;

    @NotNull(message = "Duration is required")
    @Min(value = 0, message = "Duration must be non-negative")
    @Column(nullable = false)
    private Integer duration;

    @Min(value = 0, message = "Duration seconds must be non-negative")
    private Integer durationSeconds;

    @Size(max = 50, message = "Duration formatted must not exceed 50 characters")
    @Column(length = 50)
    private String durationFormatted;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    @Column(length = 500)
    private String description;

    @Size(max = 50, message = "Status must not exceed 50 characters")
    @Column(length = 50)
    private String statuss;

    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    @Column(length = 100)
    private String email;

    public enum EntryType {
        WORK, PTO
    }
}
