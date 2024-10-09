package com.example.back.repository;

import com.example.back.entity.FavoriteId;
import com.example.back.entity.FavoriteSongEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FavoriteSongRepository extends JpaRepository<FavoriteSongEntity, FavoriteId> {
    List<FavoriteSongEntity> findAllByUserEmailAndSongPidIsIn(String email, List<UUID> ids);
}
