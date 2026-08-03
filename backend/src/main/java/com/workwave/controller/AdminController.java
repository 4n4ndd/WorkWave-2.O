package com.workwave.controller;

import com.workwave.dto.AdminDashboardStats;
import com.workwave.dto.UserResponse;
import com.workwave.entity.User;
import com.workwave.entity.UserRole;
import com.workwave.exception.ResourceNotFoundException;
import com.workwave.repository.ApplicationRepository;
import com.workwave.repository.JobRepository;
import com.workwave.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public AdminController(UserRepository userRepository, JobRepository jobRepository,
                           ApplicationRepository applicationRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userRepository.findByRole(UserRole.USER).stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/recruiters")
    public ResponseEntity<List<UserResponse>> getAllRecruiters() {
        List<UserResponse> recruiters = userRepository.findByRole(UserRole.RECRUITER).stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(recruiters);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(user);
        return ResponseEntity.ok("User deleted successfully");
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable Long id) {
        if (!jobRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job not found");
        }
        jobRepository.deleteById(id);
        return ResponseEntity.ok("Job deleted successfully");
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<AdminDashboardStats> getDashboardStats() {
        long totalUsers = userRepository.countByRole(UserRole.USER);
        long totalRecruiters = userRepository.countByRole(UserRole.RECRUITER);
        long totalJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();
        AdminDashboardStats stats = AdminDashboardStats.builder()
                .totalUsers(totalUsers)
                .totalRecruiters(totalRecruiters)
                .totalJobs(totalJobs)
                .totalApplications(totalApplications)
                .build();
        return ResponseEntity.ok(stats);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .verified(user.isVerified())
                .createdAt(user.getCreatedAt())
                .profilePhoto(user.getProfilePhoto())
                .resumeUrl(user.getResumeUrl())
                .bio(user.getBio())
                .skills(user.getSkills())
                .build();
    }
}
