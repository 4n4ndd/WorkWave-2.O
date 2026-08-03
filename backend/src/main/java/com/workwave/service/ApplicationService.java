package com.workwave.service;

import com.workwave.dto.ApplicationResponse;
import com.workwave.dto.RecruiterDashboardStats;
import com.workwave.entity.*;
import com.workwave.exception.ResourceNotFoundException;
import com.workwave.exception.UnauthorizedException;
import com.workwave.repository.ApplicationRepository;
import com.workwave.repository.JobRepository;
import com.workwave.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public ApplicationService(ApplicationRepository applicationRepository, JobRepository jobRepository,
                              UserRepository userRepository, EmailService emailService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public ApplicationResponse apply(Long jobId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getResumeUrl() == null || user.getResumeUrl().isBlank()) {
            throw new IllegalArgumentException("Please upload your resume in your profile before applying.");
        }
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (applicationRepository.existsByUserIdAndJobId(user.getId(), jobId)) {
            throw new IllegalArgumentException("You have already applied for this job.");
        }
        Application application = Application.builder()
                .appliedDate(LocalDateTime.now())
                .resumeUrl(user.getResumeUrl())
                .status(ApplicationStatus.PENDING)
                .user(user)
                .job(job)
                .build();
        Application saved = applicationRepository.save(application);
        emailService.sendEmail(
                job.getCreatedBy(),
                "New Application for " + job.getTitle(),
                user.getFullName() + " has applied for the position of " + job.getTitle()
        );
        return mapToApplicationResponse(saved);
    }

    public List<ApplicationResponse> getMyApplications(String email) {
        return applicationRepository.findByUserEmailOrderByAppliedDateDesc(email)
                .stream()
                .map(this::mapToApplicationResponse)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getJobApplications(Long jobId, String recruiterEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));
        if (!job.getCreatedBy().equals(recruiterEmail)) {
            throw new UnauthorizedException("You are not authorized to view applications for this job");
        }
        return applicationRepository.findByJobId(jobId)
                .stream()
                .map(this::mapToApplicationResponse)
                .collect(Collectors.toList());
    }

    public ApplicationResponse updateStatus(Long id, ApplicationStatus status, String recruiterEmail) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        if (!application.getJob().getCreatedBy().equals(recruiterEmail)) {
            throw new UnauthorizedException("You are not authorized to update this application's status");
        }
        application.setStatus(status);
        Application saved = applicationRepository.save(application);
        emailService.sendEmail(
                application.getUser().getEmail(),
                "WorkWave Application Update",
                "Your application for " + application.getJob().getTitle() + " at " +
                        application.getJob().getCompany() + " has been updated to: " + status.name()
        );
        return mapToApplicationResponse(saved);
    }

    public RecruiterDashboardStats getRecruiterStats(String recruiterEmail) {
        List<Job> jobs = jobRepository.findByCreatedBy(recruiterEmail);
        long totalJobs = jobs.size();
        long totalApplications = 0;
        long totalCandidates;
        List<Long> jobIds = jobs.stream().map(Job::getId).toList();
        List<Application> applications = applicationRepository.findAll().stream()
                .filter(app -> jobIds.contains(app.getJob().getId()))
                .toList();
        totalApplications = applications.size();
        totalCandidates = applications.stream()
                .map(app -> app.getUser().getId())
                .distinct()
                .count();
        return RecruiterDashboardStats.builder()
                .totalJobsPosted(totalJobs)
                .totalApplicationsReceived(totalApplications)
                .totalCandidates(totalCandidates)
                .build();
    }

    private ApplicationResponse mapToApplicationResponse(Application app) {
        return ApplicationResponse.builder()
                .id(app.getId())
                .appliedDate(app.getAppliedDate())
                .resumeUrl(app.getResumeUrl())
                .status(app.getStatus())
                .userId(app.getUser().getId())
                .userFullName(app.getUser().getFullName())
                .userEmail(app.getUser().getEmail())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .company(app.getJob().getCompany())
                .build();
    }
}
