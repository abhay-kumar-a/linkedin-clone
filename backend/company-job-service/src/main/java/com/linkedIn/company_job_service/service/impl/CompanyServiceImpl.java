package com.linkedIn.company_job_service.service.impl;

import com.linkedIn.company_job_service.dto.CompanyDto;
import com.linkedIn.company_job_service.dto.JobDto;
import com.linkedIn.company_job_service.entity.Company;
import com.linkedIn.company_job_service.entity.Job;
import com.linkedIn.company_job_service.repository.CompanyRepository;
import com.linkedIn.company_job_service.repository.JobRepository;
import com.linkedIn.company_job_service.service.CompanyService;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;

    public CompanyServiceImpl(CompanyRepository companyRepository, JobRepository jobRepository) {
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
    }

    @Override
    public CompanyDto createCompany(CompanyDto companyDto) {
        Company company = new Company();
        company.setName(companyDto.getName());
        company.setDescription(companyDto.getDescription());
        company.setIndustry(companyDto.getIndustry());
        company.setWebsite(companyDto.getWebsite());
        company.setLocation(companyDto.getLocation());
        company.setSize(companyDto.getSize());
        company.setCreatedAt(new Date());

        Company saved = companyRepository.save(company);
        return mapToDto(saved);
    }

    @Override
    public List<CompanyDto> getAllCompanies() {
        return companyRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CompanyDto getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        return mapToDto(company);
    }

    @Override
    public CompanyDto getCompanyDetailed(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        
        CompanyDto dto = mapToDto(company);
        
        List<JobDto> jobs = jobRepository.findByCompanyId(id)
                .stream()
                .map(this::mapJobToDto)
                .collect(Collectors.toList());
        dto.setJobs(jobs);
        
        return dto;
    }

    @Override
    public CompanyDto updateCompany(Long id, CompanyDto companyDto) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        
        if (companyDto.getName() != null) company.setName(companyDto.getName());
        if (companyDto.getDescription() != null) company.setDescription(companyDto.getDescription());
        if (companyDto.getIndustry() != null) company.setIndustry(companyDto.getIndustry());
        if (companyDto.getWebsite() != null) company.setWebsite(companyDto.getWebsite());
        if (companyDto.getLocation() != null) company.setLocation(companyDto.getLocation());
        if (companyDto.getSize() != null) company.setSize(companyDto.getSize());

        Company saved = companyRepository.save(company);
        return mapToDto(saved);
    }

    @Override
    public String deleteCompany(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        companyRepository.delete(company);
        return "Company deleted successfully";
    }

    private CompanyDto mapToDto(Company company) {
        CompanyDto dto = new CompanyDto();
        dto.setId(company.getId());
        dto.setName(company.getName());
        dto.setDescription(company.getDescription());
        dto.setIndustry(company.getIndustry());
        dto.setWebsite(company.getWebsite());
        dto.setLocation(company.getLocation());
        dto.setSize(company.getSize());
        return dto;
    }

    private JobDto mapJobToDto(Job job) {
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
