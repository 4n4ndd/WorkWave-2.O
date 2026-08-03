package com.workwave.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDashboardStats {
    private long recommendedJobsCount;
    private long appliedJobsCount;
    private int profileCompletionPercent;
}
