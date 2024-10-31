package tec.proyecto.guessdastuff.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tec.proyecto.guessdastuff.services.LoadDataService;

@CrossOrigin(origins = "http://localhost:5173/")
@RequestMapping("/auth")
@RestController
public class LoadDataController {

  @Autowired
    LoadDataService loadDataService;
  
  @PostMapping("/loadData")
  public ResponseEntity<?> loadData() {
    try {
      System.out.println("entro");
            String response = loadDataService.loadData();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
      }
}
