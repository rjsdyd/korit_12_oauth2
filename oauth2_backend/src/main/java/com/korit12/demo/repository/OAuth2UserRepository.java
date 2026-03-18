package com.korit12.demo.repository;

import com.korit12.demo.entity.OAuth2User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OAuth2UserRepository extends JpaRepository<OAuth2User, Long> {
    Optional<OAuth2User> findByProviderAndProviderId(String provider, String providerId);

    boolean existsByUserIdAndProvider(Long userId, String provider);
}
