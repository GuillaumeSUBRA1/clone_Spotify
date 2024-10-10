package com.example.back.controller;

import com.example.back.infrastructure.state.State;
import com.example.back.infrastructure.state.StatusNotification;
import com.example.back.record.dto.*;
import com.example.back.service.SongService;
import com.example.back.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Controller
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/song")
public class SongController {

    @Autowired
    SongService songService;

    @Autowired
    UserService userService;

    private final Validator validator;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SongController(Validator validator) {
        this.validator = validator;
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SongInfoDTO> add (@RequestPart(name = "cover") @Nullable MultipartFile cover,
                                            @RequestPart(name = "file") MultipartFile file,
                                            @RequestPart(name = "dto") String saveSong) throws IOException {
        SaveSongDTO saveSongDTO = objectMapper.readValue(saveSong,SaveSongDTO.class);
        saveSongDTO = new SaveSongDTO(
                saveSongDTO.title(),
                saveSongDTO.author(),
                cover != null ? cover.getBytes() : null,
                cover != null ? cover.getContentType() : null,
                file.getBytes(),
                file.getContentType()
        );
        Set<ConstraintViolation<SaveSongDTO>> violation = validator.validate(saveSongDTO);
        if(!violation.isEmpty()){
            String join = violation
                    .stream()
                    .map(v->v.getPropertyPath()+" "+v.getMessage())
                    .collect(Collectors.joining());
            ProblemDetail p = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,"Validation error for following fields : "+join);
            return ResponseEntity.of(p).build();
        }
        return ResponseEntity.ok(songService.create(saveSongDTO));
    }

    @GetMapping("/all")
    public ResponseEntity<List<SongInfoDTO>> getAll(){
        return ResponseEntity.ok(songService.getAll());
    }

    @GetMapping("/content")
    public ResponseEntity<SongContentDTO> getOne(@RequestParam UUID pid){
        Optional<SongContentDTO> song = songService.getOne(pid);
        return song.map(ResponseEntity::ok)
                .orElseGet(()->ResponseEntity.of(ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,"UUID unkonw")).build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<SongInfoDTO>> search(@RequestParam String search){
        return ResponseEntity.ok(songService.search(search));
    }

    @PostMapping("/like")
    public ResponseEntity<FavoriteSongDTO> manageFavorite(@Valid @RequestBody FavoriteSongDTO favoriteSongDTO){
        UserDTO user = userService.getAuthenticatedUser();
        State<FavoriteSongDTO, String> favState = songService.manageFavorite(favoriteSongDTO, user.email());
        if(favState.getStatus().equals(StatusNotification.ERROR)){
            ProblemDetail p = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, favState.getError());
            return ResponseEntity.of(p).build();
        } else {
            return ResponseEntity.ok(favState.getValue());
        }
    }

    @GetMapping("/get-favorite")
    public ResponseEntity<List<SongInfoDTO>> getFavorite(){
        UserDTO u = userService.getAuthenticatedUser();
        return ResponseEntity.ok(songService.getFavorite(u.email()));
    }
}
