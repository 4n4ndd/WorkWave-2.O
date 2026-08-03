package com.workwave.controller;

import com.workwave.dto.ApplicationResponse;
import com.workwave.entity.ApplicationStatus;
import com.workwave.service.ApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<ApplicationResponse> apply(@PathVariable Long jobId, Principal principal) {
        ApplicationResponse response = applicationService.apply(jobId, principal.getName());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(Principal principal) {
        List<ApplicationResponse> response = applicationService.getMyApplications(principal.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationResponse>> getJobApplications(@PathVariable Long jobId, Principal principal) {
        List<ApplicationResponse> response = applicationService.getJobApplications(jobId, principal.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/status/{applicationId}")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status,
            Principal principal
    ) {
        ApplicationResponse response = applicationService.updateStatus(applicationId, status, principal.getName());
        return ResponseEntity.ok(response);
    }
}
