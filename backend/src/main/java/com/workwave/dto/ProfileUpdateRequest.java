package com.workwave.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProfileUpdateRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String bio;

    private String skills;
}
