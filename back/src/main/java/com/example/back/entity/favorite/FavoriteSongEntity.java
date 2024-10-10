package com.example.back.entity.favorite;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "favorite_song")
@IdClass(FavoriteId.class)
public class FavoriteSongEntity implements Serializable {
    @Id
    UUID songPid;

    @Id
    String userEmail;

    public UUID getSongPid() {
        return songPid;
    }

    public void setSongPid(UUID songPid) {
        this.songPid = songPid;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }
}
