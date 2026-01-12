package com.example.backend.dto;

import com.example.backend.entity.TimeEntry;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeEntryDTO {

    @NotNull(message = "Date is required")
    private String date; // Format: YYYY-MM-DD

    @NotNull(message = "Type is required")
    @Pattern(regexp = "WORK|PTO", message = "Type must be either WORK or PTO")
    private String type;

    @Size(max = 20, message = "Start time must not exceed 20 characters")
    private String startTime;

    @Size(max = 20, message = "End time must not exceed 20 characters")
    private String endTime;

    @NotNull(message = "Duration is required")
    @Min(value = 0, message = "Duration must be non-negative")
    private Integer duration;

    @Min(value = 0, message = "Duration seconds must be non-negative")
    private Integer durationSeconds;

    @Size(max = 50, message = "Duration formatted must not exceed 50 characters")
    private String durationFormatted;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @Size(max = 50, message = "Status must not exceed 50 characters")
    private String statuss;

    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;
}
