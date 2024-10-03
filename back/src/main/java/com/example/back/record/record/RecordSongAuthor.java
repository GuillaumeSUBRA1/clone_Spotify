package com.example.back.record.record;

import jakarta.validation.constraints.NotBlank;

public record RecordSongAuthor(@NotBlank String value) {
}
