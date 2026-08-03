package com.workwave.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminDashboardStats {
    private long totalUsers;
    private long totalRecruiters;
    private long totalJobs;
    private long totalApplications;
}
