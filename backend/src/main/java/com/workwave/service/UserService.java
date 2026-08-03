package com.workwave.service;

import com.workwave.dto.ProfileUpdateRequest;
import com.workwave.dto.UserDashboardStats;
import com.workwave.dto.UserResponse;
import com.workwave.entity.User;
import com.workwave.exception.ResourceNotFoundException;
import com.workwave.repository.ApplicationRepository;
import com.workwave.repository.JobRepository;
import com.workwave.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final String uploadDir = "C:/Users/Anand/.gemini/antigravity/scratch/workwave/uploads/";

    public UserService(UserRepository userRepository, JobRepository jobRepository,
                       ApplicationRepository applicationRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        try {
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs();
            }
        } catch (Exception ignored) {
        }
    }

    public UserResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserResponse(user);
    }

    public UserResponse updateProfile(String email, ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setFullName(request.getFullName());
        user.setBio(request.getBio());
        user.setSkills(request.getSkills());
        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    public String uploadProfilePhoto(String email, MultipartFile file) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + filename);
        Files.copy(file.getInputStream(), filePath);
        String fileUrl = "/api/users/files/" + filename;
        user.setProfilePhoto(fileUrl);
        userRepository.save(user);
        return fileUrl;
    }

    public String uploadResume(String email, MultipartFile file) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + filename);
        Files.copy(file.getInputStream(), filePath);
        String fileUrl = "/api/users/files/" + filename;
        user.setResumeUrl(fileUrl);
        userRepository.save(user);
        return fileUrl;
    }

    public byte[] getUploadedFile(String filename) throws IOException {
        Path filePath = Paths.get(uploadDir + filename);
        if (!Files.exists(filePath)) {
            throw new ResourceNotFoundException("File not found");
        }
        return Files.readAllBytes(filePath);
    }

    public UserDashboardStats getDashboardStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        long appliedCount = applicationRepository.findByUserEmailOrderByAppliedDateDesc(email).size();
        long totalJobs = jobRepository.count();
        int completion = 10;
        if (user.getBio() != null && !user.getBio().isBlank()) completion += 30;
        if (user.getSkills() != null && !user.getSkills().isBlank()) completion += 30;
        if (user.getProfilePhoto() != null) completion += 15;
        if (user.getResumeUrl() != null) completion += 15;
        return UserDashboardStats.builder()
                .appliedJobsCount(appliedCount)
                .recommendedJobsCount(totalJobs)
                .profileCompletionPercent(completion)
                .build();
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
