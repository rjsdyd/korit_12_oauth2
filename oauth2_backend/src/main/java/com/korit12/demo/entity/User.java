package com.korit12.demo.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(exclude = "oAuth2Users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = true)
    private String password;

    @Column(nullable = false)
    @Enumerated
    private Role role = Role.ROLE_USER;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OAuth2User> oAuth2Users = new ArrayList<>();

    @Column(nullable = false, length = 50)
    private String name;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // 일반 회원 가입용
    public static User createLocalUser(String email, String encodePassword, String name) {
        User user = new User();
        user.email= email;
        user.password = encodePassword;
        user.name = name;
        user.role = Role.ROLE_USER;
        return user;
    }

    // 소셜 로그인 용 (password가 없음)
    public static User createOauth2User(String email, String name) {
        User user = new User();
        user.email = email;
        user.password = null;
        user.name = name;
        user.role = Role.ROLE_USER;
        return user;
    }

    public enum Role {
        ROLE_USER, ROLE_ADMIN
    }
}
