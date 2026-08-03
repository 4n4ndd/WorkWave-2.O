package com.workwave.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecruiterDashboardStats {
    private long totalJobsPosted;
    private long totalApplicationsReceived;
    private long totalCandidates;
}
