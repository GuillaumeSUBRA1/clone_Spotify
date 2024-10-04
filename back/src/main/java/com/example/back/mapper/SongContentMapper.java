package com.example.back.mapper;

import com.example.back.entity.SongContentEntity;
import com.example.back.record.dto.SaveSongDTO;
import com.example.back.record.dto.SongContentDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SongContentMapper {

    @Mapping(source = "song.pid", target="pid")
    SongContentDTO entityToDTO(SongContentEntity songContentEntity);

    SongContentEntity saveSongDTOToEntity(SaveSongDTO songDTO);
}
