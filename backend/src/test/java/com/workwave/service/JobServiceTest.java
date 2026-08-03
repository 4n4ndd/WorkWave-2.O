package com.workwave.service;

import com.workwave.dto.JobRequest;
import com.workwave.dto.JobResponse;
import com.workwave.entity.Job;
import com.workwave.entity.User;
import com.workwave.entity.UserRole;
import com.workwave.repository.JobRepository;
import com.workwave.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.time.LocalDateTime;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private JobService jobService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateJob() {
        JobRequest request = new JobRequest();
        request.setTitle("Software Engineer");
        request.setDescription("Develop Java Apps");
        request.setCompany("WorkWave");
        request.setLocation("Remote");
        request.setExperienceRequired(2);
        request.setSalary(80000.0);
        request.setJobType("Full-time");

        User recruiter = User.builder()
                .id(1L)
                .email("recruiter@workwave.com")
                .role(UserRole.RECRUITER)
                .build();

        Job savedJob = Job.builder()
                .id(100L)
                .title(request.getTitle())
                .description(request.getDescription())
                .company(request.getCompany())
                .location(request.getLocation())
                .experienceRequired(request.getExperienceRequired())
                .salary(request.getSalary())
                .jobType(request.getJobType())
                .postedDate(LocalDateTime.now())
                .createdBy("recruiter@workwave.com")
                .recruiter(recruiter)
                .build();

        when(userRepository.findByEmail("recruiter@workwave.com")).thenReturn(Optional.of(recruiter));
        when(jobRepository.save(any(Job.class))).thenReturn(savedJob);

        JobResponse response = jobService.createJob(request, "recruiter@workwave.com");

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals("Software Engineer", response.getTitle());
        verify(jobRepository, times(1)).save(any(Job.class));
    }

    @Test
    public void testGetJobById() {
        Job job = Job.builder()
                .id(100L)
                .title("Product Manager")
                .description("Manage items")
                .company("WorkWave")
                .location("Remote")
                .experienceRequired(5)
                .salary(120000.0)
                .jobType("Full-time")
                .postedDate(LocalDateTime.now())
                .createdBy("recruiter@workwave.com")
                .build();

        when(jobRepository.findById(100L)).thenReturn(Optional.of(job));

        JobResponse response = jobService.getJobById(100L);

        assertNotNull(response);
        assertEquals("Product Manager", response.getTitle());
    }
}
