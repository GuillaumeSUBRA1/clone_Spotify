package com.example.back.infrastructure.config;

import com.example.back.entity.UserEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.*;
import java.util.stream.Stream;

public class SecurityUtils {
    public static UserEntity mapAuth2ToUser(Map<String, Object> attr) {
        UserEntity user = new UserEntity();
        String sub = String.valueOf(attr.get("sub"));
        String username = null;
        if (attr.get("preferred_username") != null) {
            username = ((String) attr.get("preferred_username")).toLowerCase();
        }
        if (attr.get("given_name") != null) {
            user.setFirstName(((String) attr.get("given_name")));
        } else if (attr.get("nickname") != null) {
            user.setFirstName(((String) attr.get("nickname")));
        }

        if (attr.get("email") != null) {
            user.setEmail((String) attr.get("email"));
        } else if (sub.contains("|") && (username != null && username.contains("@"))) {
            user.setEmail(username);
        } else {
            user.setEmail(sub);
        }

        if (attr.get("family_name") != null) {
            user.setLastName(((String) attr.get("family_name")));
        }

        if (attr.get("picture") != null) {
            user.setImageUrl((String) attr.get("picture"));
        }

        return user;
    }
}
