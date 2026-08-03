package com.workwave.dto;

import com.workwave.entity.UserRole;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private UserRole role;
    private boolean verified;
    private LocalDateTime createdAt;
    private String profilePhoto;
    private String resumeUrl;
    private String bio;
    private String skills;
}
