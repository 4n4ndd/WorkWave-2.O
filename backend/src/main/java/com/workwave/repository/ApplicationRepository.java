package com.workwave.repository;

import com.workwave.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserEmailOrderByAppliedDateDesc(String email);
    List<Application> findByJobId(Long jobId);
    boolean existsByUserIdAndJobId(Long userId, Long jobId);
}
