package com.example.backend.controller;

import com.example.backend.dto.ApiResponse;
import com.example.backend.dto.PtoDayDTO;
import com.example.backend.dto.PtoDayResponse;
import com.example.backend.service.PtoDayService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pto-days")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PtoDayController {

    private final PtoDayService ptoDayService;

    @PostMapping
    public ResponseEntity<ApiResponse<PtoDayResponse>> createPtoDay(@Valid @RequestBody Map<String, PtoDayDTO> request) {
        PtoDayDTO dto = request.get("data");
        if (dto == null) {
            throw new IllegalArgumentException("Request body must contain 'data' field");
        }
        
        PtoDayResponse response = ptoDayService.createPtoDay(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PtoDayResponse>> updatePtoDay(
            @PathVariable Long id,
            @Valid @RequestBody Map<String, PtoDayDTO> request) {
        
        PtoDayDTO dto = request.get("data");
        if (dto == null) {
            throw new IllegalArgumentException("Request body must contain 'data' field");
        }
        
        PtoDayResponse response = ptoDayService.updatePtoDay(id, dto);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PtoDayResponse>>> getAllPtoDays(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        List<PtoDayResponse> ptoDays;
        
        if (startDate != null && endDate != null) {
            ptoDays = ptoDayService.getPtoDaysByDateRange(startDate, endDate);
        } else {
            ptoDays = ptoDayService.getAllPtoDays();
        }
        
        return ResponseEntity.ok(ApiResponse.success(ptoDays));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PtoDayResponse>> getPtoDayById(@PathVariable Long id) {
        PtoDayResponse response = ptoDayService.getPtoDayById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deletePtoDay(@PathVariable Long id) {
        ptoDayService.deletePtoDay(id);
        return ResponseEntity.ok(ApiResponse.success("PTO day deleted successfully"));
    }
}
