package tec.proyecto.guessdastuff.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @Autowired
    UserService userService;

    @PostMapping("/v1/login")
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

    @PostMapping("/v1/register")
    public ResponseEntity<?> register(@RequestBody DtoRegisterRequest request) throws UserException {
        try {
            DtoAuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception exce) {
            /*DtoAuthResponse errorResponse = DtoAuthResponse.builder()
                    .message("User registration failed. Please try again.")
                    .build();*/
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exce.getMessage());
        }
    }

    @PostMapping("/v1/forgot-password/{email}") 
    public ResponseEntity<String> forgotPassword(@PathVariable String email) {
        try {
            userService.processforgot_password(email);
            return ResponseEntity.ok("Password reset link has been sent to your email.");
        }catch ( Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/v1/validate-password")
    public ResponseEntity<String> validateResetToken(@RequestParam String token) {
        if (userService.validatePasswordResetToken(token)) {
            return ResponseEntity.ok("Token is valid. Please provide a new password.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token.");
        }
    }

    @PostMapping("/v1/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        String response = userService.updatePassword(token, newPassword);
        if(response == "Token válido"){
            return ResponseEntity.ok("Password has been reset successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token.");
        }
    }  
    
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PutMapping("/v1/logout/{username}")
    public ResponseEntity<?> logout(@PathVariable String username){
        try {
            return ResponseEntity.ok(authService.logout(username));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}