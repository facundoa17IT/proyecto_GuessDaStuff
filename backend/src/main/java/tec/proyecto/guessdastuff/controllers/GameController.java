package tec.proyecto.guessdastuff.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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


@CrossOrigin(origins = "http://localhost:5173/")
@RequestMapping("/api/admin")
@RestController
public class GameController {

    @Autowired
    GameService gameService;

    @GetMapping("getDataOfGM/{idGame}")
    public ResponseEntity<?> getDataOfGameMode(@PathVariable Long idGame){
        try {
            return ResponseEntity.ok(gameService.getDataOfGameMode(idGame));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/listTitles/{idCategory}")
    public ResponseEntity<?> listTitlesOfCategory(@PathVariable Long idCategory){
        try {
            return ResponseEntity.ok(gameService.listTitlesOfCategory(idCategory));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // ORDER BY DATE
    @PostMapping("/ODBIndividual")
    public ResponseEntity<?> createODBIndividual(@RequestBody DtoOrderByDate dtoOrderByDate){
        try {
            return ResponseEntity.ok(gameService.createODBIndividual(dtoOrderByDate));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/ODBMasive")
    public ResponseEntity<?> createOBDMasive(@RequestParam Long idCategory, @RequestParam MultipartFile file){
        try {
            return ResponseEntity.ok(gameService.createOBDMasive(idCategory, file));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // ORDER WORD
    @PostMapping("/OWIndividual")
    public ResponseEntity<?> createOWIndividual(@RequestBody DtoOrderWord dtoOrderWord){
        try {
            return ResponseEntity.ok(gameService.createOWIndividual(dtoOrderWord));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
 
    @PostMapping("/OWMasive")
    public ResponseEntity<?> createOWMasive(@RequestParam Long idCategory, @RequestParam MultipartFile file){
        try {
            return ResponseEntity.ok(gameService.createOWMasive(idCategory, file));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // GUESS PHRASE
    @PostMapping("/GPIndividual")
    public ResponseEntity<?> createGPIndividual(@RequestBody DtoGuessPhrase dtoGuessPhrase){
        try {
            return ResponseEntity.ok(gameService.createGPIndividual(dtoGuessPhrase));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/GPMasive")
    public ResponseEntity<?> createGPMasive(@RequestParam Long idCategory, @RequestParam MultipartFile file){
        try {
            return ResponseEntity.ok(gameService.createGPMasive(idCategory, file));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @PutMapping("/editOrderByDate/{idGame}")
    public ResponseEntity<?> editOrderByDate(@PathVariable Long idGame, @RequestBody DtoOrderByDate dtoOrderByDate) {
        try {
            return ResponseEntity.ok(gameService.editOrderByDate(idGame, dtoOrderByDate));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/editOrderWord/{idGame}")
    public ResponseEntity<?> editOrderWord(@PathVariable Long idGame, @RequestBody DtoOrderWord dtoOrderWord) {
        try {
            return ResponseEntity.ok(gameService.editOrderWord(idGame, dtoOrderWord));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/editGuessPhrase/{idGame}")
    public ResponseEntity<?> editGuessPhrase(@PathVariable Long idGame, @RequestBody DtoGuessPhrase dtoGuessPhrase) {
        try {
            return ResponseEntity.ok(gameService.editGuessPhrase(idGame, dtoGuessPhrase));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
