package com.example.backend.repository;

import com.example.backend.entity.TimeEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {

    // Find entries by date range
    List<TimeEntry> findByDateBetween(LocalDate startDate, LocalDate endDate);

    // Find entries by specific date
    List<TimeEntry> findByDate(LocalDate date);

    // Find entries by type
    List<TimeEntry> findByType(TimeEntry.EntryType type);

    // Find entries by date range and type
    @Query("SELECT t FROM TimeEntry t WHERE t.date BETWEEN :startDate AND :endDate AND t.type = :type")
    List<TimeEntry> findByDateRangeAndType(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("type") TimeEntry.EntryType type
    );

    // Get all entries ordered by date descending
    List<TimeEntry> findAllByOrderByDateDesc();
}
