package com.workwave.controller;

import com.workwave.dto.ProfileUpdateRequest;
import com.workwave.dto.RecruiterDashboardStats;
import com.workwave.dto.UserDashboardStats;
import com.workwave.dto.UserResponse;
import com.workwave.entity.User;
import com.workwave.entity.UserRole;
import com.workwave.exception.ResourceNotFoundException;
import com.workwave.repository.UserRepository;
import com.workwave.service.ApplicationService;
import com.workwave.service.UserService;
import jakarta.validation.Valid;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final ApplicationService applicationService;
    private final UserRepository userRepository;

    public UserController(UserService userService, ApplicationService applicationService, UserRepository userRepository) {
        this.userService = userService;
        this.applicationService = applicationService;
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(Principal principal) {
        UserResponse response = userService.getProfile(principal.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @Valid @RequestBody ProfileUpdateRequest request,
            Principal principal
    ) {
        UserResponse response = userService.updateProfile(principal.getName(), request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/profile/photo")
    public ResponseEntity<String> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            Principal principal
    ) throws IOException {
        String fileUrl = userService.uploadProfilePhoto(principal.getName(), file);
        return ResponseEntity.ok(fileUrl);
    }

    @PostMapping("/profile/resume")
    public ResponseEntity<String> uploadResume(
            @RequestParam("file") MultipartFile file,
            Principal principal
    ) throws IOException {
        String fileUrl = userService.uploadResume(principal.getName(), file);
        return ResponseEntity.ok(fileUrl);
    }

    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) throws IOException {
        byte[] data = userService.getUploadedFile(filename);
        ByteArrayResource resource = new ByteArrayResource(data);
        MediaType mediaType = filename.toLowerCase().endsWith(".pdf") ? MediaType.APPLICATION_PDF : MediaType.IMAGE_JPEG;
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .contentType(mediaType)
                .body(resource);
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() == UserRole.RECRUITER) {
            RecruiterDashboardStats stats = applicationService.getRecruiterStats(user.getEmail());
            return ResponseEntity.ok(stats);
        } else if (user.getRole() == UserRole.USER) {
            UserDashboardStats stats = userService.getDashboardStats(user.getEmail());
            return ResponseEntity.ok(stats);
        }
        return ResponseEntity.badRequest().body("No stats available for this role");
    }
}
