package com.example.back.repository;

import com.example.back.entity.SongContentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SongContentRepository extends JpaRepository<SongContentEntity,Long> {
}
