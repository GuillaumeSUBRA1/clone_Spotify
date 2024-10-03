package com.example.back.entity;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public class FavoriteId implements Serializable {
    UUID songPid;
    String userEmail;

    public FavoriteId() {
    }

    public FavoriteId(UUID songPid, String userEmail) {
        this.songPid = songPid;
        this.userEmail = userEmail;
    }

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FavoriteId that = (FavoriteId) o;
        return Objects.equals(songPid, that.songPid) && Objects.equals(userEmail, that.userEmail);
    }

    @Override
    public int hashCode() {
        return Objects.hash(songPid, userEmail);
    }
}
