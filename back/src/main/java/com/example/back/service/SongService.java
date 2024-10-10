package com.example.back.service;

import com.example.back.entity.favorite.FavoriteId;
import com.example.back.entity.favorite.FavoriteSongEntity;
import com.example.back.entity.SongContentEntity;
import com.example.back.entity.SongEntity;
import com.example.back.infrastructure.state.State;
import com.example.back.infrastructure.state.StateBuilder;
import com.example.back.mapper.SongContentMapper;
import com.example.back.mapper.SongMapper;
import com.example.back.record.dto.*;
import com.example.back.repository.FavoriteSongRepository;
import com.example.back.repository.SongContentRepository;
import com.example.back.repository.SongRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class SongService {

    @Autowired
    SongRepository songRepository;

    @Autowired
    SongContentRepository songContentRepository;

    @Autowired
    FavoriteSongRepository favoriteSongRepository;

    @Autowired
    SongMapper songMapper;

    @Autowired
    SongContentMapper songContentMapper;

    @Autowired
    UserService userService;

    public SongInfoDTO create(SaveSongDTO saveSongDTO){
        SongEntity s = songMapper.saveSongDTOToEntity(saveSongDTO);
        SongEntity saved = songRepository.save(s);

        SongContentEntity content = songContentMapper.saveSongDTOToEntity(saveSongDTO);
        content.setSong(saved);

        songContentRepository.save(content);
        return songMapper.entityToSongInfoDTO(saved);
    }

    @Transactional
    public List<SongInfoDTO> getAll(){
        List<SongInfoDTO> songs = songRepository
                .findAll()
                .stream()
                .map(songMapper::entityToSongInfoDTO)
                .toList();

        if(userService.isAuthenticated()){
            return getFavoriteStatus(songs);
        }
        return songs;
    }

    public Optional<SongContentDTO> getOne(UUID pid){
        Optional<SongContentEntity> song = songContentRepository.findBySongPid(pid);
        return song.map(songContentMapper::entityToDTO);
    }

    public List<SongInfoDTO> search(String search){
        List<SongInfoDTO> songs = songRepository.findByTitleOrAuthorContainingSearch(search)
                .stream()
                .map(songMapper::entityToSongInfoDTO)
                .collect(Collectors.toList());

        if(userService.isAuthenticated()){
            return getFavoriteStatus(songs);
        }
        return songs;
    }

    public State<FavoriteSongDTO, String> manageFavorite(FavoriteSongDTO favorite, String email){
        StateBuilder<FavoriteSongDTO,String> builder=State.builder();
        Optional<SongEntity> songOpt = songRepository.findByPid(favorite.pid());
        if(songOpt.isEmpty()){
            return builder.forError("Song pid does not exist").build();
        }

        SongEntity toLike = songOpt.get();
        UserDTO user = userService.getByEmail(email).orElseThrow();

        if(favorite.favorite()){
            FavoriteSongEntity fav= new FavoriteSongEntity();
            fav.setSongPid(toLike.getPid());
            fav.setUserEmail(user.email());
            favoriteSongRepository.save(fav);
        } else {
            FavoriteId id = new FavoriteId(toLike.getPid(), user.email());
            favoriteSongRepository.deleteById(id);
            favorite = new FavoriteSongDTO(false, toLike.getPid());
        }
        return builder.forSuccess(favorite).build();
    }

    public List<SongInfoDTO> getFavorite(String email){
        return songRepository.findAllFavoriteByUserEmail(email)
                .stream()
                .map(songMapper::entityToSongInfoDTO)
                .toList();
    }

    private List<SongInfoDTO> getFavoriteStatus(List<SongInfoDTO> songs){
        UserDTO user = userService.getAuthenticatedUser();
        List<UUID> ids = songs.stream().map(SongInfoDTO::getPid).toList();
        List<UUID> fav = favoriteSongRepository.findAllByUserEmailAndSongPidIsIn(user.email(), ids)
                .stream().map(FavoriteSongEntity::getSongPid).toList();
        return songs.stream().peek(s->{
            if(fav.contains(s.getPid())){
                s.setFavorite(true);
            }
        }).toList();
    }
}
