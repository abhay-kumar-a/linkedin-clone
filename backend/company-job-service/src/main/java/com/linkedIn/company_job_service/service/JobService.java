package com.linkedIn.company_job_service.service;

import com.linkedIn.company_job_service.dto.JobDto;

import java.util.List;

public interface JobService {
    JobDto createJob(JobDto jobDto);
    List<JobDto> getAllJobs();
    JobDto getJobById(Long id);
    JobDto getJobDetailed(Long id);
    List<JobDto> getJobsByCompany(Long companyId);
    List<JobDto> getJobsByCategory(Long categoryId);
    List<JobDto> getJobsSorted(String sortType);
    JobDto updateJob(Long id, JobDto jobDto);
    String deleteJob(Long id);
    String applyJob(Long jobId, Long userId);
}
