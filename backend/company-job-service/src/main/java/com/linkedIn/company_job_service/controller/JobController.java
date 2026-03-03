package com.linkedIn.company_job_service.controller;

import com.linkedIn.company_job_service.dto.JobDto;
import com.linkedIn.company_job_service.service.JobService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<JobDto> createJob(@RequestBody JobDto jobDto) {
        JobDto created = jobService.createJob(jobDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<JobDto>> getAllJobs() {
        List<JobDto> jobs = jobService.getAllJobs();
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDto> getJobById(@PathVariable Long id) {
        JobDto job = jobService.getJobById(id);
        return ResponseEntity.ok(job);
    }

    @GetMapping("/detailed/{id}")
    public ResponseEntity<JobDto> getJobDetailed(@PathVariable Long id) {
        JobDto job = jobService.getJobDetailed(id);
        return ResponseEntity.ok(job);
    }

    @GetMapping("/company/{id}")
    public ResponseEntity<List<JobDto>> getJobsByCompany(@PathVariable Long id) {
        List<JobDto> jobs = jobService.getJobsByCompany(id);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/category/{id}")
    public ResponseEntity<List<JobDto>> getJobsByCategory(@PathVariable Long id) {
        List<JobDto> jobs = jobService.getJobsByCategory(id);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/sorted/{sortType}")
    public ResponseEntity<List<JobDto>> getJobsSorted(@PathVariable String sortType) {
        List<JobDto> jobs = jobService.getJobsSorted(sortType);
        return ResponseEntity.ok(jobs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobDto> updateJob(@PathVariable Long id, @RequestBody JobDto jobDto) {
        JobDto updated = jobService.updateJob(id, jobDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable Long id) {
        String response = jobService.deleteJob(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/applied")
    public ResponseEntity<String> applyJob(@RequestBody Map<String, Long> request, HttpServletRequest httpRequest) {
        Long jobId = request.get("jobId");
        Long userId = getUserId(httpRequest);
        String response = jobService.applyJob(jobId, userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/applied/{id}")
    public ResponseEntity<List> getApplications(@PathVariable Long id) {
        return ResponseEntity.ok(List.of());
    }

    private Long getUserId(HttpServletRequest request) {
        String userIdHeader = request.getHeader("X-User-Id");
        if (userIdHeader != null) {
            return Long.parseLong(userIdHeader);
        }
        return 1L;
    }
}
