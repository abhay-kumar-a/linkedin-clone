package com.linkedIn.company_job_service.controller;

import com.linkedIn.company_job_service.entity.JobCategory;
import com.linkedIn.company_job_service.repository.JobCategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    private final JobCategoryRepository categoryRepository;

    public CategoryController(JobCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @PostMapping
    public ResponseEntity<JobCategory> createCategory(@RequestBody JobCategory category) {
        JobCategory created = categoryRepository.save(category);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<JobCategory>> getAllCategories() {
        List<JobCategory> categories = categoryRepository.findAll();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobCategory> getCategoryById(@PathVariable Long id) {
        JobCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return ResponseEntity.ok(category);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobCategory> updateCategory(@PathVariable Long id, @RequestBody JobCategory category) {
        JobCategory existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        if (category.getName() != null) existing.setName(category.getName());
        if (category.getDescription() != null) existing.setDescription(category.getDescription());
        
        JobCategory updated = categoryRepository.save(existing);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok("Category deleted");
    }
}
