package com.linkedIn.company_job_service.repository;

import com.linkedIn.company_job_service.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByCompanyId(Long companyId);
    List<Job> findByCategoryId(Long categoryId);
    List<Job> findAllByOrderByCreatedAtDesc();
    List<Job> findAllByOrderByCreatedAtAsc();
}
