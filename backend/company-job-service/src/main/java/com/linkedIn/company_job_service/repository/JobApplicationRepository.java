package com.linkedIn.company_job_service.repository;

import com.linkedIn.company_job_service.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByJobId(Long jobId);
    Optional<JobApplication> findByJobIdAndUserId(Long jobId, Long userId);
    boolean existsByJobIdAndUserId(Long jobId, Long userId);
}
