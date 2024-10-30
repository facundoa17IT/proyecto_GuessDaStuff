package tec.proyecto.guessdastuff.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import tec.proyecto.guessdastuff.dtos.DtoAuthResponse;
import tec.proyecto.guessdastuff.dtos.DtoLoginRequest;
import tec.proyecto.guessdastuff.dtos.DtoRegisterRequest;
import tec.proyecto.guessdastuff.entities.User;
import tec.proyecto.guessdastuff.exceptions.UserException;
import tec.proyecto.guessdastuff.repositories.UserRepository;
import tec.proyecto.guessdastuff.services.AuthService;
import tec.proyecto.guessdastuff.services.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @Autowired
    UserService userService;

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody DtoLoginRequest request) throws UserException {
        try {
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
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

     
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

    // Endpoint para solicitar un enlace de restablecimiento de contraseña
    @PostMapping("/forgot-password") 
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        try {
            userService.processforgot_password(email);
            return ResponseEntity.ok("Password reset link has been sent to your email.");
        }catch ( Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // Endpoint para validar el token de restablecimiento de contraseña
    @GetMapping("/reset-password")
    public ResponseEntity<String> validateResetToken(@RequestParam String token) {
        if (userService.validatePasswordResetToken(token)) {
            return ResponseEntity.ok("Token is valid. Please provide a new password.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token.");
        }
    }

    // Endpoint para restablecer la contraseña
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        String response = userService.updatePassword(token, newPassword);
        if(response == "Token válido"){
            return ResponseEntity.ok("Password has been reset successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token.");
        }
    }  

    @PutMapping("/logout/{username}")
    public ResponseEntity<?> logout(@PathVariable String username){
        try {
            return ResponseEntity.ok(authService.logout(username));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}