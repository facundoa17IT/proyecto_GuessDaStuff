package tec.proyecto.guessdastuff.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import tec.proyecto.guessdastuff.dtos.DtoAdmin;
import tec.proyecto.guessdastuff.dtos.DtoUserRequest;
import tec.proyecto.guessdastuff.services.GameService;
import tec.proyecto.guessdastuff.services.UserService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    UserService userService;

    @Autowired
    GameService gameService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/v1")
    public ResponseEntity<?> listUsers(){
        try {
            return ResponseEntity.ok(userService.listUsers());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/v1/active")
    public ResponseEntity<?> listActiveUsers(){
        try {
            return ResponseEntity.ok(userService.listActiveUsers());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/v1/gamesOfPlayer/{idUser}")
    public ResponseEntity<?> listGamesOfPlayer(@PathVariable String idUser){
        try {
            return ResponseEntity.ok(gameService.listGamesOfPlayer(idUser));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/v1/{username}")
    public ResponseEntity<?> findUserByUsername(@PathVariable String username){
        try {
            return ResponseEntity.ok(userService.findUserByUsername(username));
        } catch (Exception e) {
           return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/v1/edit/{username}")
    public ResponseEntity<?> editUser(@PathVariable String username, @RequestBody DtoUserRequest dtoUser){
        try {
            return ResponseEntity.ok(userService.editUser(username, dtoUser));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PutMapping("/v1/delete/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username){
        try {
            return ResponseEntity.ok(userService.deleteUser(username));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/v1")
    public ResponseEntity<?> addAdmin(@RequestBody DtoAdmin dtoAdmin){
        try {
            return ResponseEntity.ok(userService.addAdmin(dtoAdmin));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/v1/block/{username}")
    public ResponseEntity<?> blockUser(@PathVariable String username){
        try {
            return ResponseEntity.ok(userService.blockUser(username));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/v1/unblock/{username}")
    public ResponseEntity<?> unblockUser(@PathVariable String username){
        try {
            return ResponseEntity.ok(userService.unblockUser(username));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
