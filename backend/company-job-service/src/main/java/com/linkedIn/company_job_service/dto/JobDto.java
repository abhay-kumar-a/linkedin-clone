package com.linkedIn.company_job_service.dto;

import lombok.Data;

@Data
public class JobDto {
    private Long id;
    private String title;
    private String description;
    private String requirements;
    private String location;
    private String salary;
    private String jobType;
    private Long companyId;
    private String companyName;
    private Long categoryId;
    private String categoryName;
}
