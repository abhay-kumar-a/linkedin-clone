package com.linkedin.auth_service.controller;

import com.linkedin.auth_service.dto.AuthResponse;
import com.linkedin.auth_service.dto.LoginRequest;
import com.linkedin.auth_service.dto.RegisterRequest;
import com.linkedin.auth_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, Boolean>> validateToken(@RequestHeader("Authorization") String token) {
        String jwt = token.replace("Bearer ", "");
        boolean valid = authService.validateToken(jwt);
        return ResponseEntity.ok(Map.of("valid", valid));
    }

    @GetMapping("/user-id")
    public ResponseEntity<Map<String, Long>> getUserId(@RequestHeader("Authorization") String token) {
        String jwt = token.replace("Bearer ", "");
        Long userId = authService.getUserIdFromToken(jwt);
        return ResponseEntity.ok(Map.of("userId", userId));
    }
}
