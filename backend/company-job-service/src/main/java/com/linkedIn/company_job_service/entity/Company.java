package com.linkedIn.company_job_service.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String industry;

    private String website;

    private String location;

    private String size;

    @Column(name = "created_at")
    private Date createdAt;
}
