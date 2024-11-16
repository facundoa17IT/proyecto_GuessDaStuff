package tec.proyecto.guessdastuff.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


import org.springframework.web.bind.annotation.*;
import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiRequest;
import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiResponse;
import tec.proyecto.guessdastuff.services.PlayMultiService;

@CrossOrigin(origins = "http://localhost:8080/")
//@CrossOrigin(origins = "http://localhost:5173/")
//@PreAuthorize("hasRole('USER')")
@RestController
@RequestMapping("/api/game-multi")
public class SocketPlayMultiController {
    
    @Autowired
    private PlayMultiService playMultiService;

    // Endpoint para iniciar la partida
    @PostMapping("/v1/start/{gameId}/")
    public  ResponseEntity<DtoInitGameMultiResponse>  startGame(@PathVariable String gameId, @RequestBody DtoInitGameMultiRequest dtoInitGameMultiRequest) {
        try {
            DtoInitGameMultiResponse response = playMultiService.startGame(gameId, dtoInitGameMultiRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}