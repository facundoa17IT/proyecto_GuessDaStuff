package tec.proyecto.guessdastuff.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import tec.proyecto.guessdastuff.services.*;
import tec.proyecto.guessdastuff.dtos.*;
import java.util.Map;


@CrossOrigin(origins = "http://localhost:5173/")
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/game-modes")
@RestController
public class GameController {

    @Autowired
    GameService gameService;

    @GetMapping("/v1/{idGame}")
    public ResponseEntity<?> getDataOfGameMode(@PathVariable Long idGame){
        try {
            return ResponseEntity.ok(gameService.getDataOfGameMode(idGame));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/v1/titles/{idCategory}")
    public ResponseEntity<?> listTitlesOfCategory(@PathVariable Long idCategory){
        try {
            return ResponseEntity.ok(gameService.listTitlesOfCategory(idCategory));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/v1")
    public ResponseEntity<?> listGames() {
        try {
            DtoLoadPlaygameResponse response = gameService.listPlayGames();
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/v1/individual/MC")
    public ResponseEntity<?> createMCIndividual(@RequestBody DtoMultipleChoice dtoMultipleChoice){
        try {
            return ResponseEntity.ok(gameService.createMCIndividual(dtoMultipleChoice));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/v1/masive/MC")
    public ResponseEntity<?> createMCMasive(@RequestParam Long idCategory, @RequestParam MultipartFile file){
        try {
            return ResponseEntity.ok(gameService.createMCMasive(idCategory, file));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/v1/individual/OW")
    public ResponseEntity<?> createOWIndividual(@RequestBody DtoOrderWord dtoOrderWord){
        try {
            return ResponseEntity.ok(gameService.createOWIndividual(dtoOrderWord));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
 
    @PostMapping("/v1/masive/OW")
    public ResponseEntity<?> createOWMasive(@RequestParam Long idCategory, @RequestParam MultipartFile file){
        try {
            return ResponseEntity.ok(gameService.createOWMasive(idCategory, file));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/v1/individual/GP")
    public ResponseEntity<?> createGPIndividual(@RequestBody DtoGuessPhrase dtoGuessPhrase){
        try {
            return ResponseEntity.ok(gameService.createGPIndividual(dtoGuessPhrase));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/v1/masive/GP")
    public ResponseEntity<?> createGPMasive(@RequestParam Long idCategory, @RequestParam MultipartFile file){
        try {
            return ResponseEntity.ok(gameService.createGPMasive(idCategory, file));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @PutMapping("/v1/MC/{idGame}")
    public ResponseEntity<?> editMultipleCoice(@PathVariable Long idGame, @RequestBody DtoMultipleChoice dtoMultipleChoice) {
        try {
            return ResponseEntity.ok(gameService.editMultipleCoice(idGame, dtoMultipleChoice));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/v1/OW/{idGame}")
    public ResponseEntity<?> editOrderWord(@PathVariable Long idGame, @RequestBody DtoOrderWord dtoOrderWord) {
        try {
            return ResponseEntity.ok(gameService.editOrderWord(idGame, dtoOrderWord));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/v1/GP/{idGame}")
    public ResponseEntity<?> editGuessPhrase(@PathVariable Long idGame, @RequestBody DtoGuessPhrase dtoGuessPhrase) {
        try {
            return ResponseEntity.ok(gameService.editGuessPhrase(idGame, dtoGuessPhrase));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
