package com.linkedIn.company_job_service.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "applied_at")
    private Date appliedAt;

    private String status;
}
