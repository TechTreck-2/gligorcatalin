package com.example.backend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PtoDayDTO {

    @NotNull(message = "PTO date is required")
    private String ptoDate; // Format: YYYY-MM-DD

    @NotNull(message = "Submitted date is required")
    private String submittedOn; // Format: YYYY-MM-DD

    @NotNull(message = "Reason is required")
    @Size(max = 500, message = "Reason must not exceed 500 characters")
    private String reason;

    @NotNull(message = "Status is required")
    @Pattern(regexp = "Pending|Approved|Rejected", message = "Status must be Pending, Approved, or Rejected")
    private String statuss;
}
