package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PtoDayResponse {
    private Long id;
    private String ptoDate;
    private String submittedOn;
    private String reason;
    private String statuss;
}
