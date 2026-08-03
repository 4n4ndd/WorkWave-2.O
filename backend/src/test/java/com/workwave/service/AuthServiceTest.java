package com.workwave.service;

import com.workwave.dto.LoginRequest;
import com.workwave.dto.AuthResponse;
import com.workwave.entity.User;
import com.workwave.entity.UserRole;
import com.workwave.exception.UnauthorizedException;
import com.workwave.jwt.JwtService;
import com.workwave.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testLoginSuccess() {
        LoginRequest request = new LoginRequest();
        request.setEmail("user@workwave.com");
        request.setPassword("password123");

        User user = User.builder()
                .id(1L)
                .email("user@workwave.com")
                .password("encodedPassword")
                .role(UserRole.USER)
                .verified(true)
                .build();

        when(userRepository.findByEmail("user@workwave.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encodedPassword")).thenReturn(true);
        when(jwtService.generateToken(any())).thenReturn("mockJwtToken");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mockJwtToken", response.getToken());
        assertEquals("user@workwave.com", response.getUser().getEmail());
    }

    @Test
    public void testLoginFailInvalidPassword() {
        LoginRequest request = new LoginRequest();
        request.setEmail("user@workwave.com");
        request.setPassword("wrongpassword");

        User user = User.builder()
                .id(1L)
                .email("user@workwave.com")
                .password("encodedPassword")
                .role(UserRole.USER)
                .verified(true)
                .build();

        when(userRepository.findByEmail("user@workwave.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpassword", "encodedPassword")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
    }
}
