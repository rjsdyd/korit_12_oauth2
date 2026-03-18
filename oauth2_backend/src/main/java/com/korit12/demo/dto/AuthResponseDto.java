package com.korit12.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponseDto {
    private String token;
    private String email;
    private String name;
    private String role;

    public static AuthResponseDto of(String token, String email, String name, String role) {
        return new AuthResponseDto(token, email, name, role);
    }
}
