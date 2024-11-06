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
@RequestMapping("/api/game-single")
@RestController
public class PlayController {
    
    @Autowired
    PlayService playService;

    // LOAD GAME
    @PostMapping("/v1/load-game")
    public ResponseEntity<DtoLoadGameResponse> loadGame(@RequestBody DtoLoadGameRequest dtoLoadGameRequest) {
        try {
            DtoLoadGameResponse response = playService.loadGame(dtoLoadGameRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // INIT GAME
    @PostMapping("/v1/init-game")
    public ResponseEntity<DtoInitGameResponse> initGame(@RequestBody DtoInitGameRequest dtoInitGameRequest) {
        try {
            DtoInitGameResponse response = playService.initGame(dtoInitGameRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // PLAY GAME
    @PostMapping("/v1/play-game")
    public ResponseEntity<Boolean> playGame(@RequestBody DtoPlayGameRequest dtoPlayGameRequest) {
        try {
            Boolean response = playService.playGame(dtoPlayGameRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // Setear tiempo de inicio de partida
    @PostMapping("/v1/init-play-game/{idGameSingle}")
    public ResponseEntity<Boolean> initPlayGame(String idGameSingle) {
        try {
            Boolean response = playService.initPlayGame(idGameSingle);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // Terminar partida
    @PostMapping("/v1/finish-play-game/{idGameSingle}")
    public ResponseEntity<Boolean> finishPlayGame(String idGameSingle) {
        try {
            Boolean response = playService.finishPlayGame(idGameSingle);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    
}
