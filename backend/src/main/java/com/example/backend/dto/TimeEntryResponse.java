package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeEntryResponse {
    private Long id;
    private String date;
    private String type;
    private String startTime;
    private String endTime;
    private Integer duration;
    private Integer durationSeconds;
    private String durationFormatted;
    private String description;
    private String statuss;
    private String email;
}
