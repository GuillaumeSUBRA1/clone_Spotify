package com.example.back.service;

import com.example.back.entity.SongContentEntity;
import com.example.back.entity.SongEntity;
import com.example.back.mapper.SongContentMapper;
import com.example.back.mapper.SongMapper;
import com.example.back.record.dto.SaveSongDTO;
import com.example.back.record.dto.SongInfoDTO;
import com.example.back.repository.SongContentRepository;
import com.example.back.repository.SongRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class SongService {

    @Autowired
    SongRepository songRepository;

    @Autowired
    SongContentRepository songContentRepository;

    @Autowired
    SongMapper songMapper;

    @Autowired
    SongContentMapper songContentMapper;

    public SongInfoDTO create(SaveSongDTO saveSongDTO){
        SongEntity s = songMapper.saveSongDTOToEntity(saveSongDTO);
        SongEntity saved = songRepository.save(s);

        SongContentEntity content = songContentMapper.saveSongDTOToEntity(saveSongDTO);
        content.setSong(saved);

        songContentRepository.save(content);
        return songMapper.entityToSongInfoDTO(saved);
    }
}
