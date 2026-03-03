package com.linkedIn.company_job_service.service;

import com.linkedIn.company_job_service.dto.CompanyDto;

import java.util.List;

public interface CompanyService {
    CompanyDto createCompany(CompanyDto companyDto);
    List<CompanyDto> getAllCompanies();
    CompanyDto getCompanyById(Long id);
    CompanyDto getCompanyDetailed(Long id);
    CompanyDto updateCompany(Long id, CompanyDto companyDto);
    String deleteCompany(Long id);
}
