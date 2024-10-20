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

import tec.proyecto.guessdastuff.dtos.DtoOrderByDate;
import tec.proyecto.guessdastuff.services.OrderByDateService;

@CrossOrigin(origins = "http://localhost:5173/")
@RequestMapping("/api/admin")
@RestController
public class OrderByDateController {

    @Autowired
    OrderByDateService orderByDateService;

    @PostMapping("/ODBIndividual")
    public ResponseEntity<?> createODBIndividual(@RequestBody DtoOrderByDate dtoOrderByDate){
        try {
            return ResponseEntity.ok(orderByDateService.createODBIndividual(dtoOrderByDate));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/ODBMasive")
    public ResponseEntity<?> createOBDMasive(@RequestParam Long idCategory, @RequestParam MultipartFile file){
        try {
            return ResponseEntity.ok(orderByDateService.createOBDMasive(idCategory, file));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

      
}
