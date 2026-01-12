package com.example.backend.repository;

import com.example.backend.entity.PtoDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PtoDayRepository extends JpaRepository<PtoDay, Long> {

    List<PtoDay> findByPtoDateBetween(LocalDate startDate, LocalDate endDate);
    
    List<PtoDay> findByPtoDate(LocalDate date);
    
    List<PtoDay> findByStatuss(PtoDay.PtoStatus status);
    
    List<PtoDay> findAllByOrderByPtoDateDesc();
}
