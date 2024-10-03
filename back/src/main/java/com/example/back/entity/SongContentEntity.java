package com.example.back.entity;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "song_content")
public class SongContentEntity implements Serializable {
    @Id
    Long id;

    @MapsId
    @OneToOne
    @JoinColumn(name = "id", referencedColumnName = "id")
    SongEntity song;

    @Lob
    @Column(nullable = false)
    byte[] file;

    String fileContentType;
}
