package com.korit12.demo.controller;

import com.korit12.demo.dto.AuthResponseDto;
import com.korit12.demo.dto.LoginRequestDto;
import com.korit12.demo.dto.SignUpRequestDto;
import com.korit12.demo.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    // POST/api/auth/signup
    @PostMapping("/signup")
    public ResponseEntity<AuthResponseDto> signup(@Valid @RequestBody SignUpRequestDto dto) {
        return ResponseEntity.ok(userService.signup(dto));
    }

    // POST/api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto dto) {
        return ResponseEntity.ok(userService.login(dto));
    }

    // 구글 로그인 시작 URL 안내 (실제 시작은 /oauth2/authorization/google)
    @GetMapping("/oauth2/google/url")
    public ResponseEntity<String> getGoogleLoginUrl() {
        return ResponseEntity.ok("http://localhost:8080/oauth2/authorization/google");
    }

    // OAuth2 로그인 실패 시 호출
    @GetMapping("/oauth2/failure")
    public ResponseEntity<String> oauth2Failure() {
        return ResponseEntity.badRequest().body("소셜 로그인에 실패했습니다.");
    }
}
