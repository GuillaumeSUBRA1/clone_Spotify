package com.example.back.repository;

import com.example.back.entity.SongEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SongRepository extends JpaRepository<SongEntity, Long> {

    @Query("SELECT s FROM SongEntity s WHERE lower(s.title) LIKE lower(concat('%',:search,'%')) OR lower(s.author) LIKE lower(concat('%',:search,'%'))")
    List<SongEntity> findByTitleOrAuthorContainingSearch(String search);

    Optional<SongEntity> findByPid(UUID pid);

    @Query("SELECT s FROM SongEntity s JOIN FavoriteSongEntity f on s.pid = f.songPid WHERE f.userEmail = :email")
    List<SongEntity> findAllFavoriteByUserEmail(String email);
}
