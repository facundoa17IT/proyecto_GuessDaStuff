package tec.proyecto.guessdastuff.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import tec.proyecto.guessdastuff.services.LoadDataService;

@CrossOrigin(origins = "http://localhost:5173/")
@RestController
public class LoadDataController {

  @Autowired
    LoadDataService loadDataService;
  
  @PostMapping("/api/v1/load-data")
  public ResponseEntity<?> loadData() {
    try {
            return ResponseEntity.ok(loadDataService.loadData());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
      }
}
