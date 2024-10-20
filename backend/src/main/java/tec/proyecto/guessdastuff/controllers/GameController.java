package tec.proyecto.guessdastuff.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
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

    // ORDER BY DATE
    @PostMapping("/ODBIndividual")
    public ResponseEntity<?> createODBIndividual(@RequestBody DtoOrderByDate dtoOrderByDate){
        try {
            return ResponseEntity.ok(gameService.createODBIndividual(dtoOrderByDate));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
/* 
    @PostMapping("/ODBMasive")
    public ResponseEntity<?> createOBDMasive(@RequestParam Long idCategory, @RequestParam MultipartFile file){
        try {
            return ResponseEntity.ok(gameService.createOBDMasive(idCategory, file));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
*/
    // ORDER WORD
    @PostMapping("/OWIndividual")
    public ResponseEntity<?> createOWIndividual(@RequestBody DtoOrderWord dtoOrderWord){
        try {
            return ResponseEntity.ok(gameService.createOWIndividual(dtoOrderWord));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
/* 
    @PostMapping("/OWMasive")
    public ResponseEntity<?> createOWMasive(@RequestParam Long idCategory, @RequestParam MultipartFile file){
        try {
            return ResponseEntity.ok(gameService.createOBDMasive(idCategory, file));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
*/
    // GUESS PHRASE
    @PostMapping("/GPIndividual")
    public ResponseEntity<?> createGPIndividual(@RequestBody DtoGuessPhrase dtoGuessPhrase){
        try {
            return ResponseEntity.ok(gameService.createGPIndividual(dtoGuessPhrase));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
/* 
    @PostMapping("/GPMasive")
    public ResponseEntity<?> createGPMasive(@RequestParam Long idCategory, @RequestParam MultipartFile file){
        try {
            return ResponseEntity.ok(gameService.createOBDMasive(idCategory, file));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
      */
}
