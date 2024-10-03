package com.example.back.service;

import com.example.back.entity.UserEntity;
import com.example.back.infrastructure.config.SecurityUtils;
import com.example.back.mapper.UserMapper;
import com.example.back.record.dto.UserDTO;
import com.example.back.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    UserMapper userMapper;

    public void syncWithIdp(OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        UserEntity user = SecurityUtils.mapAuth2ToUser(attributes);
        Optional<UserEntity> existingUser = userRepository.findOneByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            if (attributes.get("updated_at") != null) {
                Instant dbLastModifiedDate = existingUser.orElseThrow().getLastModified();
                Instant idpModifiedDate;
                if(attributes.get("updated_at") instanceof Instant) {
                    idpModifiedDate = (Instant) attributes.get("updated_at");
                } else {
                    idpModifiedDate = Instant.ofEpochSecond((Integer) attributes.get("updated_at"));
                }
                if(idpModifiedDate.isAfter(dbLastModifiedDate)) {
                    updateUser(user);
                }
            }
        } else {
            userRepository.saveAndFlush(user);
        }
    }

    public UserDTO getAuthenticatedUser(){
        OAuth2User user = (OAuth2User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserEntity u = SecurityUtils.mapAuth2ToUser(user.getAttributes());
        return userMapper.entityToDTO(u);
    }

    public void updateUser(UserEntity user){
        Optional<UserEntity> toUpdateOpt = userRepository.findOneByEmail(user.getEmail());
        if(toUpdateOpt.isPresent()){
            UserEntity u = toUpdateOpt.get();
            u.setEmail(toUpdateOpt.get().getEmail());
            u.setImageUrl(toUpdateOpt.get().getImageUrl());
            u.setLastName(toUpdateOpt.get().getLastName());
            u.setFirstName(toUpdateOpt.get().getFirstName());
        }
    }

    public Optional<UserDTO> getByEmail(String email) {
        Optional<UserEntity> oneByEmail = userRepository.findOneByEmail(email);
        return oneByEmail.map(userMapper::entityToDTO);
    }

    public boolean isAuthenticated() {
        return !SecurityContextHolder.getContext().getAuthentication().getPrincipal().equals("anonymousUser");
    }

}
