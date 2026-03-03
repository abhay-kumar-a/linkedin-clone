package com.linkedIn.company_job_service.service.impl;

import com.linkedIn.company_job_service.dto.JobDto;
import com.linkedIn.company_job_service.entity.Company;
import com.linkedIn.company_job_service.entity.Job;
import com.linkedIn.company_job_service.entity.JobApplication;
import com.linkedIn.company_job_service.entity.JobCategory;
import com.linkedIn.company_job_service.repository.CompanyRepository;
import com.linkedIn.company_job_service.repository.JobApplicationRepository;
import com.linkedIn.company_job_service.repository.JobCategoryRepository;
import com.linkedIn.company_job_service.repository.JobRepository;
import com.linkedIn.company_job_service.service.JobService;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final JobCategoryRepository categoryRepository;
    private final JobApplicationRepository applicationRepository;

    public JobServiceImpl(JobRepository jobRepository, CompanyRepository companyRepository,
                          JobCategoryRepository categoryRepository, JobApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.categoryRepository = categoryRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    public JobDto createJob(JobDto jobDto) {
        Job job = new Job();
        job.setTitle(jobDto.getTitle());
        job.setDescription(jobDto.getDescription());
        job.setRequirements(jobDto.getRequirements());
        job.setLocation(jobDto.getLocation());
        job.setSalary(jobDto.getSalary());
        job.setJobType(jobDto.getJobType());
        job.setCreatedAt(new Date());

        if (jobDto.getCompanyId() != null) {
            Company company = companyRepository.findById(jobDto.getCompanyId())
                    .orElseThrow(() -> new RuntimeException("Company not found"));
            job.setCompany(company);
        }

        if (jobDto.getCategoryId() != null) {
            JobCategory category = categoryRepository.findById(jobDto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            job.setCategory(category);
        }

        Job saved = jobRepository.save(job);
        return mapToDto(saved);
    }

    @Override
    public List<JobDto> getAllJobs() {
        return jobRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public JobDto getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return mapToDto(job);
    }

    @Override
    public JobDto getJobDetailed(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return mapToDto(job);
    }

    @Override
    public List<JobDto> getJobsByCompany(Long companyId) {
        return jobRepository.findByCompanyId(companyId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobDto> getJobsByCategory(Long categoryId) {
        return jobRepository.findByCategoryId(categoryId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<JobDto> getJobsSorted(String sortType) {
        List<Job> jobs;
        if ("asc".equals(sortType)) {
            jobs = jobRepository.findAllByOrderByCreatedAtAsc();
        } else {
            jobs = jobRepository.findAllByOrderByCreatedAtDesc();
        }
        return jobs.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public JobDto updateJob(Long id, JobDto jobDto) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (jobDto.getTitle() != null) job.setTitle(jobDto.getTitle());
        if (jobDto.getDescription() != null) job.setDescription(jobDto.getDescription());
        if (jobDto.getRequirements() != null) job.setRequirements(jobDto.getRequirements());
        if (jobDto.getLocation() != null) job.setLocation(jobDto.getLocation());
        if (jobDto.getSalary() != null) job.setSalary(jobDto.getSalary());
        if (jobDto.getJobType() != null) job.setJobType(jobDto.getJobType());

        Job saved = jobRepository.save(job);
        return mapToDto(saved);
    }

    @Override
    public String deleteJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        jobRepository.delete(job);
        return "Job deleted successfully";
    }

    @Override
    public String applyJob(Long jobId, Long userId) {
        if (applicationRepository.existsByJobIdAndUserId(jobId, userId)) {
            throw new RuntimeException("Already applied to this job");
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setUserId(userId);
        application.setAppliedAt(new Date());
        application.setStatus("APPLIED");

        applicationRepository.save(application);
        return "Job applied successfully";
    }

    private JobDto mapToDto(Job job) {
        JobDto dto = new JobDto();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setRequirements(job.getRequirements());
        dto.setLocation(job.getLocation());
        dto.setSalary(job.getSalary());
        dto.setJobType(job.getJobType());
        if (job.getCompany() != null) {
            dto.setCompanyId(job.getCompany().getId());
            dto.setCompanyName(job.getCompany().getName());
        }
        if (job.getCategory() != null) {
            dto.setCategoryId(job.getCategory().getId());
            dto.setCategoryName(job.getCategory().getName());
        }
        return dto;
    }
}
