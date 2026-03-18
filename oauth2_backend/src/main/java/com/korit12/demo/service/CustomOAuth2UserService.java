package com.korit12.demo.service;

import com.korit12.demo.entity.User;
import com.korit12.demo.repository.OAuth2UserRepository;
import com.korit12.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;
    private final OAuth2UserRepository oAuth2UserRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId();  // 'google'
        String accessToken = userRequest.getAccessToken().getTokenValue();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String providerId = (String)attributes.get("sub");
        String email = (String)attributes.get("email");
        String name = (String)attributes.get("name");

        com.korit12.demo.entity.OAuth2User savedOAuth2User = oAuth2UserRepository
                .findByProviderAndProviderId(provider, providerId)
                .orElse(null);

        User user;

        if(savedOAuth2User == null) {
            user = userRepository.findByEmail(email)
                    .orElseGet(() -> userRepository.save(User.createOauth2User(email, name)));

            oAuth2UserRepository.
                    save(com.korit12.demo.entity.OAuth2User.created(user, provider, providerId, accessToken));
        } else {
            savedOAuth2User.updateAccessToken(accessToken);
            user = savedOAuth2User.getUser();
        }
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(user.getRole().name())),
                attributes,
                "email"
        );
    }
}
