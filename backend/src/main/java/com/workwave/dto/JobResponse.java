package com.workwave.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String company;
    private String location;
    private Integer experienceRequired;
    private Double salary;
    private String jobType;
    private LocalDateTime postedDate;
    private String createdBy;
}
