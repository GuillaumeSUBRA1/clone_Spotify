package com.example.back.record.record;

import jakarta.validation.constraints.NotBlank;

public record RecordSongTitle(@NotBlank String value) {
}
