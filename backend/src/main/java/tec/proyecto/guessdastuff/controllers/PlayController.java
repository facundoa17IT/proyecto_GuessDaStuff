package tec.proyecto.guessdastuff.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tec.proyecto.guessdastuff.services.*;
import tec.proyecto.guessdastuff.dtos.*;

@CrossOrigin(origins = "http://localhost:5173/")
@RequestMapping("/api/user/game")
@RestController
public class PlayController {
    
    @Autowired
    PlayService playService;

    // LOAD GAME
    @PostMapping("/loadGame")
    public ResponseEntity<DtoLoadGameResponse> loadGame(@RequestBody DtoLoadGameRequest dtoLoadGameRequest) {
        try {
            DtoLoadGameResponse response = playService.loadGame(dtoLoadGameRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // INIT GAME
    @PostMapping("/initGame")
    public ResponseEntity<DtoInitGameResponse> initGame(@RequestBody DtoInitGameRequest dtoInitGameRequest) {
        try {
            DtoInitGameResponse response = playService.initGame(dtoInitGameRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}
