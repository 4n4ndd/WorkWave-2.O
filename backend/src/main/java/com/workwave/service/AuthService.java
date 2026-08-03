package com.workwave.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.workwave.dto.*;
import com.workwave.entity.User;
import com.workwave.entity.UserRole;
import com.workwave.exception.InvalidOTPException;
import com.workwave.exception.ResourceNotFoundException;
import com.workwave.exception.UnauthorizedException;
import com.workwave.exception.UserAlreadyExistsException;
import com.workwave.jwt.JwtService;
import com.workwave.repository.UserRepository;
import com.workwave.security.CustomUserDetails;
import com.workwave.util.OTPUtil;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RedisTemplate<String, Object> redisTemplate;
    private final EmailService emailService;
    private final OTPUtil otpUtil;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
                       RedisTemplate<String, Object> redisTemplate, EmailService emailService, OTPUtil otpUtil,
                       RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.redisTemplate = redisTemplate;
        this.emailService = emailService;
        this.otpUtil = otpUtil;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email is already registered");
        }
        String otp = otpUtil.generateOTP();
        try {
            String jsonRequest = objectMapper.writeValueAsString(request);
            redisTemplate.opsForValue().set("temp-user:" + request.getEmail(), jsonRequest, 5, TimeUnit.MINUTES);
            redisTemplate.opsForValue().set("otp:" + request.getEmail(), otp, 5, TimeUnit.MINUTES);
        } catch (Exception e) {
            throw new RuntimeException("Error processing registration");
        }
        emailService.sendEmail(request.getEmail(), "Verify your WorkWave account", "Your OTP is: " + otp);
    }

    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        String savedOtp = (String) redisTemplate.opsForValue().get("otp:" + request.getEmail());
        if (savedOtp == null || !savedOtp.equals(request.getOtp())) {
            throw new InvalidOTPException("Invalid or expired OTP");
        }
        String jsonRequest = (String) redisTemplate.opsForValue().get("temp-user:" + request.getEmail());
        if (jsonRequest == null) {
            throw new InvalidOTPException("Registration session expired");
        }
        RegisterRequest registerRequest;
        try {
            registerRequest = objectMapper.readValue(jsonRequest, RegisterRequest.class);
        } catch (Exception e) {
            throw new RuntimeException("Error processing user verification");
        }
        User user = User.builder()
                .fullName(registerRequest.getFullName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole())
                .verified(true)
                .createdAt(LocalDateTime.now())
                .build();
        User savedUser = userRepository.save(user);
        redisTemplate.delete("otp:" + request.getEmail());
        redisTemplate.delete("temp-user:" + request.getEmail());
        CustomUserDetails userDetails = new CustomUserDetails(savedUser);
        String token = jwtService.generateToken(userDetails);
        return AuthResponse.builder()
                .token(token)
                .user(mapToUserResponse(savedUser))
                .build();
    }

    public void resendOtp(ResendOtpRequest request) {
        String jsonRequest = (String) redisTemplate.opsForValue().get("temp-user:" + request.getEmail());
        if (jsonRequest == null) {
            throw new ResourceNotFoundException("No active registration session found. Please register again.");
        }
        String otp = otpUtil.generateOTP();
        redisTemplate.opsForValue().set("otp:" + request.getEmail(), otp, 5, TimeUnit.MINUTES);
        emailService.sendEmail(request.getEmail(), "Verify your WorkWave account", "Your new OTP is: " + otp);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        if (!user.isVerified()) {
            throw new UnauthorizedException("Please verify your account first");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String token = jwtService.generateToken(userDetails);
        return AuthResponse.builder()
                .token(token)
                .user(mapToUserResponse(user))
                .build();
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        if (!userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceNotFoundException("User not found with email: " + request.getEmail());
        }
        String otp = otpUtil.generateOTP();
        redisTemplate.opsForValue().set("reset-otp:" + request.getEmail(), otp, 5, TimeUnit.MINUTES);
        emailService.sendEmail(request.getEmail(), "Reset your WorkWave password", "Your password reset OTP is: " + otp);
    }

    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        String savedOtp = (String) redisTemplate.opsForValue().get("reset-otp:" + request.getEmail());
        if (savedOtp == null || !savedOtp.equals(request.getOtp())) {
            throw new InvalidOTPException("Invalid or expired OTP");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        redisTemplate.delete("reset-otp:" + request.getEmail());
    }

    @SuppressWarnings("unchecked")
    public AuthResponse googleLogin(GoogleLoginRequest request) {
        String tokeninfoUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + request.getCredential();
        try {
            Map<String, Object> payload = restTemplate.getForObject(tokeninfoUrl, Map.class);
            if (payload == null || payload.containsKey("error_description")) {
                throw new UnauthorizedException("Invalid Google token");
            }
            String email = (String) payload.get("email");
            String name = (String) payload.get("name");
            String picture = (String) payload.get("picture");
            Optional<User> userOpt = userRepository.findByEmail(email);
            User user;
            if (userOpt.isPresent()) {
                user = userOpt.get();
                if (!user.isVerified()) {
                    user.setVerified(true);
                    user = userRepository.save(user);
                }
            } else {
                user = User.builder()
                        .fullName(name != null ? name : "Google User")
                        .email(email)
                        .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .role(UserRole.USER)
                        .verified(true)
                        .createdAt(LocalDateTime.now())
                        .profilePhoto(picture)
                        .build();
                user = userRepository.save(user);
            }
            CustomUserDetails userDetails = new CustomUserDetails(user);
            String token = jwtService.generateToken(userDetails);
            return AuthResponse.builder()
                    .token(token)
                    .user(mapToUserResponse(user))
                    .build();
        } catch (Exception e) {
            throw new UnauthorizedException("Google login failed");
        }
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .verified(user.isVerified())
                .createdAt(user.getCreatedAt())
                .profilePhoto(user.getProfilePhoto())
                .resumeUrl(user.getResumeUrl())
                .bio(user.getBio())
                .skills(user.getSkills())
                .build();
    }
}
