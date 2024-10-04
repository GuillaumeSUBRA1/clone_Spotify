package com.example.back.controller;

import com.auth0.net.Response;
import com.example.back.record.dto.SaveSongDTO;
import com.example.back.record.dto.SongInfoDTO;
import com.example.back.service.SongService;
import com.example.back.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;
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
    public ResponseEntity<SongInfoDTO> add (@RequestPart(name = "cover") MultipartFile cover,
                                            @RequestPart(name = "file") MultipartFile file,
                                            @RequestPart(name = "dto") String saveSong) throws IOException {
        SaveSongDTO saveSongDTO = objectMapper.readValue(saveSong,SaveSongDTO.class);
        saveSongDTO = new SaveSongDTO(
                saveSongDTO.title(),
                saveSongDTO.author(),
                cover.getBytes(),
                cover.getContentType(),
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
}
