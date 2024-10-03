package com.example.back.mapper;

import com.example.back.record.dto.UserDTO;
import com.example.back.entity.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")

public interface UserMapper {
    UserDTO entityToDTO(UserEntity user);

}
