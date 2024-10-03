package com.example.back.record.dto;

import com.example.back.record.record.RecordSongAuthor;
import com.example.back.record.record.RecordSongTitle;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class SongInfoDTO {
    RecordSongTitle title;
    RecordSongAuthor author;

    @NotNull byte[] cover;
    @NotNull String coverContentType;
    @NotNull boolean isFavorite;
    @NotNull UUID pid;

    public RecordSongTitle getTitle() {
        return title;
    }

    public void setTitle(RecordSongTitle title) {
        this.title = title;
    }

    public RecordSongAuthor getAuthor() {
        return author;
    }

    public void setAuthor(RecordSongAuthor author) {
        this.author = author;
    }

    public byte[] getCover() {
        return cover;
    }

    public void setCover(byte[] cover) {
        this.cover = cover;
    }

    public String getCoverContentType() {
        return coverContentType;
    }

    public void setCoverContentType(String coverContentType) {
        this.coverContentType = coverContentType;
    }

    public boolean isFavorite() {
        return isFavorite;
    }

    public void setFavorite(boolean favorite) {
        isFavorite = favorite;
    }

    public UUID getPid() {
        return pid;
    }

    public void setPid(UUID pid) {
        this.pid = pid;
    }
}
