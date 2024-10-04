package com.example.back.mapper;

import com.example.back.entity.SongEntity;
import com.example.back.record.dto.SaveSongDTO;
import com.example.back.record.dto.SongInfoDTO;
import com.example.back.record.record.RecordSongAuthor;
import com.example.back.record.record.RecordSongTitle;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SongMapper {

    @Mapping(target = "id", ignore=true)
    @Mapping(target = "pid", ignore=true)
    SongEntity saveSongDTOToEntity(SaveSongDTO saveSongDTO);

    @Mapping(target = "favorite", ignore=true)
    SongInfoDTO entityToSongInfoDTO(SongEntity songEntity);

    default RecordSongTitle stringToRecordSongTitle(String title){
        return new RecordSongTitle(title);
    }

    default RecordSongAuthor stringToRecordSongAuthor(String author){
        return new RecordSongAuthor(author);
    }

    default String recordSongTitleToString(RecordSongTitle title){
        return title.value();
    }

    default String recordSongAuthorToString(RecordSongAuthor author){
        return author.value();
    }
}
