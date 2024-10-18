package tec.proyecto.guessdastuff.controllers;

import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tec.proyecto.guessdastuff.dtos.DtoAuthResponse;
import tec.proyecto.guessdastuff.dtos.DtoLoginRequest;
import tec.proyecto.guessdastuff.dtos.DtoRegisterRequest;
import tec.proyecto.guessdastuff.entities.User;
import tec.proyecto.guessdastuff.repositories.UserRepository;
import tec.proyecto.guessdastuff.services.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("login")
    public ResponseEntity<DtoAuthResponse> login(@RequestBody DtoLoginRequest request) {
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

        if (!userOptional.isPresent()) {
            DtoAuthResponse errorResponse = DtoAuthResponse.builder()
                    .message("Usuario incorrecto!")
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }

        User user = userOptional.get();
        boolean isPasswordValid = authService.checkPassword(request.getPassword(), user.getPassword());

        if (!isPasswordValid) {
            DtoAuthResponse errorResponse = DtoAuthResponse.builder()
                    .message("Contraseña incorrecta!")
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }

        // Generate and return authentication token
        DtoAuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("register")
    public ResponseEntity<DtoAuthResponse> register(@RequestBody DtoRegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            DtoAuthResponse errorResponse = DtoAuthResponse.builder()
                    .message("El nombre de usuario ya existe!")
                    .build();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }

        try {
            DtoAuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception exce) {
            DtoAuthResponse errorResponse = DtoAuthResponse.builder()
                    .message("User registration failed. Please try again.")
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}