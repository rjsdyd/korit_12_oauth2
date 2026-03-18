package com.korit12.demo.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.security.Provider;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "oauth2_users",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"provider", "provider_id"}
        )
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(exclude = "user")
public class OAuth2User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 20)
    private String provider;

    @Column(name = "provider_id", nullable = false, length = 255)
    private String providerId;

    @Column(name = "access_token", length = 500)
    private String accessToken;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public static OAuth2User created(User user, String provider, String providerId, String accessToken) {
        OAuth2User oAuth2User = new OAuth2User();
        oAuth2User.user = user;
        oAuth2User.provider = provider;
        oAuth2User.providerId = providerId;
        oAuth2User.accessToken = accessToken;
        return oAuth2User;
    }

    public void updateAccessToken(String newAccessToken) {
        this.accessToken = newAccessToken;
    }
}
