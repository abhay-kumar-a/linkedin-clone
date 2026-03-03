package com.linkedIn.company_job_service.dto;

import lombok.Data;

import java.util.List;

@Data
public class CompanyDto {
    private Long id;
    private String name;
    private String description;
    private String industry;
    private String website;
    private String location;
    private String size;
    private List<JobDto> jobs;
}
