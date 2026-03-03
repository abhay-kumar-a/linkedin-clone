package com.linkedIn.company_job_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table
public class JobCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;
}
