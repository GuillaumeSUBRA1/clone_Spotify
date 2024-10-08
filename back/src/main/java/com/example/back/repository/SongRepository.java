package com.example.back.repository;

import com.example.back.entity.SongEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SongRepository extends JpaRepository<SongEntity, Long> {

    @Query("SELECT s FROM SongEntity s WHERE lower(s.title) LIKE lower(concat('%',:search,'%')) OR lower(s.author) LIKE lower(concat('%',:search,'%'))")
    List<SongEntity> findByTitleOrAuthorContainingSearch(String search);
}
