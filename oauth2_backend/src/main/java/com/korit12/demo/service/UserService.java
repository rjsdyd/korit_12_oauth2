package com.korit12.demo.service;

import com.korit12.demo.dto.AuthResponseDto;
import com.korit12.demo.dto.LoginRequestDto;
import com.korit12.demo.dto.SignUpRequestDto;
import com.korit12.demo.entity.User;
import com.korit12.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponseDto signup (SignUpRequestDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 사용중인 email입니다.");
        }
        // 비밀번호는 input 창을 통해서 string으로 넘어왔을 것.
        String encodePassword = passwordEncoder.encode(dto.getPassword());
        User user = User.createLocalUser(dto.getEmail(), encodePassword, dto.getName());
        userRepository.save(user);

        // User field 자체에는 Token이 없고 Response에서 붙어서 보낼 것임.
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponseDto.of(token, user.getEmail(), user.getName(), user.getRole().name());
    }
    public AuthResponseDto login(LoginRequestDto dto) {
        User user = userRepository.findByEmail(
                dto.getEmail()).orElseThrow(() ->
                new IllegalArgumentException("email 혹은 비밀번호가 잘못되었습니다."));

        if (user.getPassword() == null) {
            throw new IllegalArgumentException("소셜 로그인 계정입니다. 구글 / 네이버 / 카카오 로그인을 이용해주세요.");
        }

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("email 또는 비밀번호가 잘못되었습니다.");
        }
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponseDto.of(token, user.getEmail(), user.getName(), user.getRole().name());
    }
}
