package com.example.back.repository;

import com.example.back.entity.FavoriteSongEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoriteSongRepository extends JpaRepository<FavoriteSongEntity,Long> {
}
