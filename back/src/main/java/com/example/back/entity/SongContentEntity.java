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
    byte[] file;

    String fileContentType;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SongEntity getSong() {
        return song;
    }

    public void setSong(SongEntity song) {
        this.song = song;
    }

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] file) {
        this.file = file;
    }

    public String getFileContentType() {
        return fileContentType;
    }

    public void setFileContentType(String fileContentType) {
        this.fileContentType = fileContentType;
    }
}
