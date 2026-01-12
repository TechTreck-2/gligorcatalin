package com.example.backend.service;

import com.example.backend.dto.PtoDayDTO;
import com.example.backend.dto.PtoDayResponse;
import com.example.backend.entity.PtoDay;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.exception.ValidationException;
import com.example.backend.repository.PtoDayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PtoDayService {

    private final PtoDayRepository ptoDayRepository;

    @Transactional
    public PtoDayResponse createPtoDay(PtoDayDTO dto) {
        validatePtoDay(dto);
        
        PtoDay entity = convertToEntity(dto);
        PtoDay saved = ptoDayRepository.save(entity);
        
        return convertToResponse(saved);
    }

    @Transactional
    public PtoDayResponse updatePtoDay(Long id, PtoDayDTO dto) {
        PtoDay existing = ptoDayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PTO day not found with id: " + id));
        
        validatePtoDay(dto);
        
        existing.setPtoDate(parseDate(dto.getPtoDate()));
        existing.setSubmittedOn(parseDate(dto.getSubmittedOn()));
        existing.setReason(dto.getReason());
        existing.setStatuss(PtoDay.PtoStatus.valueOf(dto.getStatuss()));
        
        PtoDay updated = ptoDayRepository.save(existing);
        return convertToResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<PtoDayResponse> getAllPtoDays() {
        return ptoDayRepository.findAllByOrderByPtoDateDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PtoDayResponse getPtoDayById(Long id) {
        PtoDay entity = ptoDayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PTO day not found with id: " + id));
        return convertToResponse(entity);
    }

    @Transactional(readOnly = true)
    public List<PtoDayResponse> getPtoDaysByDateRange(String startDate, String endDate) {
        LocalDate start = parseDate(startDate);
        LocalDate end = parseDate(endDate);
        
        return ptoDayRepository.findByPtoDateBetween(start, end)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deletePtoDay(Long id) {
        if (!ptoDayRepository.existsById(id)) {
            throw new ResourceNotFoundException("PTO day not found with id: " + id);
        }
        ptoDayRepository.deleteById(id);
    }

    private void validatePtoDay(PtoDayDTO dto) {
        if (dto.getPtoDate() == null || dto.getPtoDate().trim().isEmpty()) {
            throw new ValidationException("PTO date is required");
        }
        
        if (dto.getSubmittedOn() == null || dto.getSubmittedOn().trim().isEmpty()) {
            throw new ValidationException("Submitted date is required");
        }
        
        try {
            parseDate(dto.getPtoDate());
        } catch (DateTimeParseException e) {
            throw new ValidationException("Invalid PTO date format. Expected YYYY-MM-DD");
        }
        
        try {
            parseDate(dto.getSubmittedOn());
        } catch (DateTimeParseException e) {
            throw new ValidationException("Invalid submitted date format. Expected YYYY-MM-DD");
        }
        
        if (dto.getReason() == null || dto.getReason().trim().isEmpty()) {
            throw new ValidationException("Reason is required");
        }
        
        if (dto.getReason().length() > 500) {
            throw new ValidationException("Reason must not exceed 500 characters");
        }
        
        if (dto.getStatuss() == null || dto.getStatuss().trim().isEmpty()) {
            throw new ValidationException("Status is required");
        }
        
        if (!dto.getStatuss().equals("Pending") && 
            !dto.getStatuss().equals("Approved") && 
            !dto.getStatuss().equals("Rejected")) {
            throw new ValidationException("Status must be Pending, Approved, or Rejected");
        }
    }

    private LocalDate parseDate(String dateStr) {
        return LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE);
    }

    private PtoDay convertToEntity(PtoDayDTO dto) {
        PtoDay entity = new PtoDay();
        entity.setPtoDate(parseDate(dto.getPtoDate()));
        entity.setSubmittedOn(parseDate(dto.getSubmittedOn()));
        entity.setReason(dto.getReason());
        entity.setStatuss(PtoDay.PtoStatus.valueOf(dto.getStatuss()));
        return entity;
    }

    private PtoDayResponse convertToResponse(PtoDay entity) {
        PtoDayResponse response = new PtoDayResponse();
        response.setId(entity.getId());
        response.setPtoDate(entity.getPtoDate().toString());
        response.setSubmittedOn(entity.getSubmittedOn().toString());
        response.setReason(entity.getReason());
        response.setStatuss(entity.getStatuss().name());
        return response;
    }
}
