package com.workwave.dto;

import com.workwave.entity.ApplicationStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ApplicationResponse {
    private Long id;
    private LocalDateTime appliedDate;
    private String resumeUrl;
    private ApplicationStatus status;
    private Long userId;
    private String userFullName;
    private String userEmail;
    private Long jobId;
    private String jobTitle;
    private String company;
}
