package com.example.back.repository;

import com.example.back.entity.SongContentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SongContentRepository extends JpaRepository<SongContentEntity,Long> {

    Optional<SongContentEntity> findBySongPid(UUID pid);
}
