package tec.proyecto.guessdastuff.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import tec.proyecto.guessdastuff.enums.ERole;

import tec.proyecto.guessdastuff.dtos.DtoAuthResponse;
import tec.proyecto.guessdastuff.dtos.DtoLoginRequest;
import tec.proyecto.guessdastuff.dtos.DtoRegisterRequest;
import tec.proyecto.guessdastuff.entities.User;
import tec.proyecto.guessdastuff.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public DtoAuthResponse login(DtoLoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        UserDetails user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getAuthorities());
        
        String token = jwtService.getTokenv2(extraClaims, user);
        
        return DtoAuthResponse.builder()
            .message("User successfully logged in")
            .token(token)
            .username(user.getUsername())
            .role(user.getAuthorities().toString())
            .build();

    }

    public DtoAuthResponse register(DtoRegisterRequest request) {
        ERole[] rolValues = ERole.values(); // 0 = ROLE_USER | 1 = ROLE_ADMIN
        User user = User.builder()
            .username(request.getUsername())
            .password(passwordEncoder.encode(request.getPassword())) // encrypted password
            .email(request.getEmail())
            .role(rolValues[request.getRole()])
            .build();
    
            User savedUser = userRepository.save(user);
        
        if (savedUser == null || userRepository.findById(savedUser.getId()).isEmpty()) {
            throw new RuntimeException("User registration failed. Please try again.");
        } else {
            return DtoAuthResponse.builder()
                .message("Usuario registrado correctamente!")
                .token(jwtService.getToken(user))
                .username(user.getUsername())
                .role(user.getRole().toString())
                .build(); 
        }
    }
}