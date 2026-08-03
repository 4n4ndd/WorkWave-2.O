package com.workwave.service;

import com.workwave.dto.JobRequest;
import com.workwave.dto.JobResponse;
import com.workwave.entity.Job;
import com.workwave.entity.User;
import com.workwave.entity.UserRole;
import com.workwave.exception.ResourceNotFoundException;
import com.workwave.exception.UnauthorizedException;
import com.workwave.repository.JobRepository;
import com.workwave.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobService(JobRepository jobRepository, UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public JobResponse createJob(JobRequest request, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .company(request.getCompany())
                .location(request.getLocation())
                .experienceRequired(request.getExperienceRequired())
                .salary(request.getSalary())
                .jobType(request.getJobType())
                .postedDate(LocalDateTime.now())
                .createdBy(recruiterEmail)
                .recruiter(recruiter)
                .build();

        Job savedJob = jobRepository.save(job);
        return mapToJobResponse(savedJob);
    }

    public List<JobResponse> getJobsByRecruiter(String recruiterEmail) {
        return jobRepository.findByCreatedBy(recruiterEmail)
                .stream()
                .map(this::mapToJobResponse)
                .toList();
    }

    public Page<JobResponse> getJobs(
            String keyword,
            String company,
            String location,
            Integer experienceRequired,
            String jobType,
            Pageable pageable) {

        return jobRepository
                .filterJobs(keyword, company, location, experienceRequired, jobType, pageable)
                .map(this::mapToJobResponse);
    }

    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        return mapToJobResponse(job);
    }

    public JobResponse updateJob(Long id, JobRequest request, String recruiterEmail) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (!job.getCreatedBy().equals(recruiterEmail)) {
            throw new UnauthorizedException("You are not authorized to update this job");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setExperienceRequired(request.getExperienceRequired());
        job.setSalary(request.getSalary());
        job.setJobType(request.getJobType());

        Job updatedJob = jobRepository.save(job);

        return mapToJobResponse(updatedJob);
    }

    public void deleteJob(Long id, String userEmail, UserRole role) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (role != UserRole.ADMIN && !job.getCreatedBy().equals(userEmail)) {
            throw new UnauthorizedException("You are not authorized to delete this job");
        }

        jobRepository.delete(job);
    }

    private JobResponse mapToJobResponse(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .company(job.getCompany())
                .location(job.getLocation())
                .experienceRequired(job.getExperienceRequired())
                .salary(job.getSalary())
                .jobType(job.getJobType())
                .postedDate(job.getPostedDate())
                .createdBy(job.getCreatedBy())
                .build();
    }
}