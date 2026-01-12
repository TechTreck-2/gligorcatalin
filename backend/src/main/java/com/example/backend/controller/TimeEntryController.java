package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.TimeEntryDTO;
import com.example.backend.dto.TimeEntryResponse;
import com.example.backend.service.TimeEntryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/time-entries")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Will be configured more specifically in WebConfig
public class TimeEntryController {

    private final TimeEntryService timeEntryService;

    /**
     * Create a new time entry
     * POST /api/time-entries
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TimeEntryResponse>> createTimeEntry(@Valid @RequestBody Map<String, TimeEntryDTO> request) {
        // Angular sends { data: {...} } format (Strapi-like)
        TimeEntryDTO dto = request.get("data");
        if (dto == null) {
            throw new IllegalArgumentException("Request body must contain 'data' field");
        }
        
        TimeEntryResponse response = timeEntryService.createTimeEntry(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    /**
     * Update an existing time entry
     * PUT /api/time-entries/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TimeEntryResponse>> updateTimeEntry(
            @PathVariable Long id,
            @Valid @RequestBody Map<String, TimeEntryDTO> request) {
        
        TimeEntryDTO dto = request.get("data");
        if (dto == null) {
            throw new IllegalArgumentException("Request body must contain 'data' field");
        }
        
        TimeEntryResponse response = timeEntryService.updateTimeEntry(id, dto);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Get all time entries
     * GET /api/time-entries
     * Supports filtering: ?startDate=2025-12-02&endDate=2025-12-15
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TimeEntryResponse>>> getAllTimeEntries(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        List<TimeEntryResponse> entries;
        
        if (startDate != null && endDate != null) {
            entries = timeEntryService.getTimeEntriesByDateRange(startDate, endDate);
        } else {
            entries = timeEntryService.getAllTimeEntries();
        }
        
        return ResponseEntity.ok(ApiResponse.success(entries));
    }

    /**
     * Get a specific time entry by ID
     * GET /api/time-entries/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TimeEntryResponse>> getTimeEntryById(@PathVariable Long id) {
        TimeEntryResponse response = timeEntryService.getTimeEntryById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Delete a time entry
     * DELETE /api/time-entries/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteTimeEntry(@PathVariable Long id) {
        timeEntryService.deleteTimeEntry(id);
        return ResponseEntity.ok(ApiResponse.success("Time entry deleted successfully"));
    }
}
