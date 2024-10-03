package com.example.back.record.dto;

import jakarta.persistence.Lob;

import java.util.UUID;

public record SongContentDTO(UUID pid, @Lob byte[] file, String fileContentType) {
}
