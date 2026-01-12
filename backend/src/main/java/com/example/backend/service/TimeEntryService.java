package com.example.backend.service;

import com.example.backend.dto.TimeEntryDTO;
import com.example.backend.dto.TimeEntryResponse;
import com.example.backend.entity.TimeEntry;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.exception.ValidationException;
import com.example.backend.repository.TimeEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimeEntryService {

    private final TimeEntryRepository timeEntryRepository;
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    @Transactional
    public TimeEntryResponse createTimeEntry(TimeEntryDTO dto) {
        validateTimeEntry(dto);
        
        TimeEntry entity = convertToEntity(dto);
        TimeEntry saved = timeEntryRepository.save(entity);
        
        return convertToResponse(saved);
    }

    @Transactional
    public TimeEntryResponse updateTimeEntry(Long id, TimeEntryDTO dto) {
        TimeEntry existing = timeEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Time entry not found with id: " + id));
        
        validateTimeEntry(dto);
        
        // Update fields
        existing.setDate(parseDate(dto.getDate()));
        existing.setType(TimeEntry.EntryType.valueOf(dto.getType()));
        existing.setStartTime(dto.getStartTime());
        existing.setEndTime(dto.getEndTime());
        existing.setDuration(dto.getDuration());
        existing.setDurationSeconds(dto.getDurationSeconds());
        existing.setDurationFormatted(dto.getDurationFormatted());
        existing.setDescription(dto.getDescription());
        existing.setStatuss(dto.getStatuss());
        existing.setEmail(dto.getEmail());
        
        TimeEntry updated = timeEntryRepository.save(existing);
        return convertToResponse(updated);
    }

    @Transactional(readOnly = true)
    public List<TimeEntryResponse> getAllTimeEntries() {
        return timeEntryRepository.findAllByOrderByDateDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TimeEntryResponse getTimeEntryById(Long id) {
        TimeEntry entity = timeEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Time entry not found with id: " + id));
        return convertToResponse(entity);
    }

    @Transactional(readOnly = true)
    public List<TimeEntryResponse> getTimeEntriesByDateRange(String startDate, String endDate) {
        LocalDate start = parseDate(startDate);
        LocalDate end = parseDate(endDate);
        
        return timeEntryRepository.findByDateBetween(start, end)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteTimeEntry(Long id) {
        if (!timeEntryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Time entry not found with id: " + id);
        }
        timeEntryRepository.deleteById(id);
    }

    private void validateTimeEntry(TimeEntryDTO dto) {
        // Validate date format
        if (dto.getDate() == null || dto.getDate().trim().isEmpty()) {
            throw new ValidationException("Date is required");
        }
        
        try {
            parseDate(dto.getDate());
        } catch (DateTimeParseException e) {
            throw new ValidationException("Invalid date format. Expected YYYY-MM-DD");
        }
        
        // Validate type
        if (dto.getType() == null || dto.getType().trim().isEmpty()) {
            throw new ValidationException("Type is required");
        }
        
        if (!dto.getType().equals("WORK") && !dto.getType().equals("PTO")) {
            throw new ValidationException("Type must be either WORK or PTO");
        }
        
        // Validate duration
        if (dto.getDuration() == null) {
            throw new ValidationException("Duration is required");
        }
        
        if (dto.getDuration() < 0) {
            throw new ValidationException("Duration must be non-negative");
        }
        
        // Validate duration seconds if provided
        if (dto.getDurationSeconds() != null && dto.getDurationSeconds() < 0) {
            throw new ValidationException("Duration seconds must be non-negative");
        }
        
        // Validate field lengths
        if (dto.getStartTime() != null && dto.getStartTime().length() > 20) {
            throw new ValidationException("Start time must not exceed 20 characters");
        }
        
        if (dto.getEndTime() != null && dto.getEndTime().length() > 20) {
            throw new ValidationException("End time must not exceed 20 characters");
        }
        
        if (dto.getDurationFormatted() != null && dto.getDurationFormatted().length() > 50) {
            throw new ValidationException("Duration formatted must not exceed 50 characters");
        }
        
        if (dto.getDescription() != null && dto.getDescription().length() > 500) {
            throw new ValidationException("Description must not exceed 500 characters");
        }
        
        if (dto.getStatuss() != null && dto.getStatuss().length() > 50) {
            throw new ValidationException("Status must not exceed 50 characters");
        }
        
        // Validate email format if provided
        if (dto.getEmail() != null && !dto.getEmail().trim().isEmpty()) {
            if (dto.getEmail().length() > 100) {
                throw new ValidationException("Email must not exceed 100 characters");
            }
            
            if (!EMAIL_PATTERN.matcher(dto.getEmail()).matches()) {
                throw new ValidationException("Invalid email format");
            }
        }
    }

    private LocalDate parseDate(String dateStr) {
        return LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE);
    }

    private TimeEntry convertToEntity(TimeEntryDTO dto) {
        TimeEntry entity = new TimeEntry();
        entity.setDate(parseDate(dto.getDate()));
        entity.setType(TimeEntry.EntryType.valueOf(dto.getType()));
        entity.setStartTime(dto.getStartTime());
        entity.setEndTime(dto.getEndTime());
        entity.setDuration(dto.getDuration());
        entity.setDurationSeconds(dto.getDurationSeconds());
        entity.setDurationFormatted(dto.getDurationFormatted());
        entity.setDescription(dto.getDescription());
        entity.setStatuss(dto.getStatuss());
        entity.setEmail(dto.getEmail());
        return entity;
    }

    private TimeEntryResponse convertToResponse(TimeEntry entity) {
        TimeEntryResponse response = new TimeEntryResponse();
        response.setId(entity.getId());
        response.setDate(entity.getDate().toString());
        response.setType(entity.getType().name());
        response.setStartTime(entity.getStartTime());
        response.setEndTime(entity.getEndTime());
        response.setDuration(entity.getDuration());
        response.setDurationSeconds(entity.getDurationSeconds());
        response.setDurationFormatted(entity.getDurationFormatted());
        response.setDescription(entity.getDescription());
        response.setStatuss(entity.getStatuss());
        response.setEmail(entity.getEmail());
        return response;
    }
}
