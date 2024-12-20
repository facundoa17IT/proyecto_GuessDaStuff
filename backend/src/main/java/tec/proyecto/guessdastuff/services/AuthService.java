package tec.proyecto.guessdastuff.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.time.LocalDate;


import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import tec.proyecto.guessdastuff.enums.ERole;
import tec.proyecto.guessdastuff.enums.EStatus;
import tec.proyecto.guessdastuff.exceptions.UserException;
import tec.proyecto.guessdastuff.converters.DateConverter;
import tec.proyecto.guessdastuff.dtos.DtoAuthResponse;
import tec.proyecto.guessdastuff.dtos.DtoLoginRequest;
import tec.proyecto.guessdastuff.dtos.DtoRegisterRequest;
import tec.proyecto.guessdastuff.entities.User;
import tec.proyecto.guessdastuff.entitiesSocket.DtoUserOnline;
import tec.proyecto.guessdastuff.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final DateConverter dateConverter;

    private final List<DtoUserOnline> connectedUsers = new ArrayList<>(); // Lista para almacenar usuarios conectados

    public void addListConnect(DtoUserOnline userOnline) {
        connectedUsers.add(userOnline); // Agregar usuario a la lista de conectados
        // Aquí podrías agregar lógica para notificar a otros usuarios si es necesario
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public DtoAuthResponse login(DtoLoginRequest request) throws UserException {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        UserDetails userDetail = userRepository.findByUsername(request.getUsername()).orElseThrow();
    
        // Buscar el usuario en la base de datos
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        User userEnt = userOpt.orElseThrow(() -> new UserException("User not found"));
    
        // Verificar el estado del usuario
        if (userEnt.getStatus().equals(EStatus.BLOCKED) || userEnt.getStatus().equals(EStatus.DELETED)) {
            throw new UserException("El usuario " + userEnt.getUsername() + " se encuentra bloqueado o eliminado. Por favor contactese con el administrador.");
        }
    
        // Añadir parametros al jwt
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", userDetail.getAuthorities());
        extraClaims.put("username", userDetail.getUsername());
        extraClaims.put("userId", userEnt.getId());
        extraClaims.put("email", userEnt.getEmail());
    
        // Generar el token con las reclamaciones adicionales
        String token = jwtService.generateTokenWithClaims(extraClaims, userDetail);
    
        // Actualizar el estado del usuario a ONLINE
        userEnt.setStatus(EStatus.ONLINE);
        userRepository.save(userEnt);
    
        return DtoAuthResponse.builder()
            .message("User successfully logged in")
            .token(token)
            .username(userDetail.getUsername())
            .role(userDetail.getAuthorities().toString())
            .build();
    }
    
    public DtoAuthResponse register(DtoRegisterRequest request) throws UserException {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new UserException("El nombre de usuario ya existe!");  
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserException("El email ingresado ya existe o no se puede ocupar.");  
        }

        ERole[] rolValues = ERole.values(); // 0 = ROLE_USER | 1 = ROLE_ADMIN
        LocalDate birthdate = dateConverter.toLocalDate(request.getBirthday());

        User user = User.builder()
            .username(request.getUsername())
            .password(passwordEncoder.encode(request.getPassword())) // encrypted password
            .email(request.getEmail())
            .role(rolValues[request.getRole()])
            .urlPerfil(request.getUrlPerfil())
            .country(request.getCountry())
            .birthday(birthdate)
            .status(EStatus.REGISTERED)
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

    public ResponseEntity<?> logout(String username){
        Optional<User> userOpt = userRepository.findByUsername(username);
        User user = userOpt.get();
        user.setStatus(EStatus.OFFLINE);
        userRepository.save(user);
        return ResponseEntity.ok("Finalizo la sesion");
    }

    public List<DtoUserOnline> getConnectedUsers() {
        return connectedUsers; // Retornar la lista de usuarios conectados
    }

    public void removeListConnect(String username) {
        connectedUsers.removeIf(user -> user.getUsername().equals(username)); // Eliminar usuario de la lista de conectados
    }
}