package com.workwave.repository;

import com.workwave.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByCreatedBy(String email);

    @Query("SELECT j FROM Job j WHERE " +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:company IS NULL OR LOWER(j.company) LIKE LOWER(CONCAT('%', :company, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:experienceRequired IS NULL OR j.experienceRequired <= :experienceRequired) AND " +
           "(:jobType IS NULL OR LOWER(j.jobType) = LOWER(:jobType))")
    Page<Job> filterJobs(
            @Param("keyword") String keyword,
            @Param("company") String company,
            @Param("location") String location,
            @Param("experienceRequired") Integer experienceRequired,
            @Param("jobType") String jobType,
            Pageable pageable
    );
}
