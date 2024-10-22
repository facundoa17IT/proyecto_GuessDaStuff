package tec.proyecto.guessdastuff.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import tec.proyecto.guessdastuff.dtos.DtoUser;
import tec.proyecto.guessdastuff.services.UserService;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping("/listUsers")
    public ResponseEntity<?> listUsers(){
        try {
            return ResponseEntity.ok(userService.listUsers());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping(path = "/{username}")
    public ResponseEntity<?> findUserByNickname(@PathVariable String username){
        try {
            return ResponseEntity.ok(userService.findUserByNickname(username));
        } catch (Exception e) {
           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/editUser")
    public ResponseEntity<?> editUser(@RequestBody DtoUser dtoUser){
        try {
            return ResponseEntity.ok(userService.editUser(dtoUser));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @PutMapping(path = "/deleteUser/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username){
        try {
            return ResponseEntity.ok(userService.deleteUser(username));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
