package com.example.back.record.dto;

import com.example.back.record.record.RecordSongAuthor;
import com.example.back.record.record.RecordSongTitle;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record SaveSongDTO(
        @Valid RecordSongTitle title,
        @Valid RecordSongAuthor author,
        byte[] cover,
        String coverContentType,
        @NotNull byte[] file,
        @NotNull String fileContentType
        ) {
}
