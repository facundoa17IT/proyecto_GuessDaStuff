package tec.proyecto.guessdastuff.services;

import java.util.*;
import java.io.IOException;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import tec.proyecto.guessdastuff.converters.DateConverter;
import tec.proyecto.guessdastuff.converters.UserConverter;
import tec.proyecto.guessdastuff.dtos.DtoAdmin;
import tec.proyecto.guessdastuff.dtos.DtoUserRequest;
import tec.proyecto.guessdastuff.dtos.DtoUserResponse;
import tec.proyecto.guessdastuff.entities.User;
import tec.proyecto.guessdastuff.enums.ERole;
import tec.proyecto.guessdastuff.enums.EStatus;
import tec.proyecto.guessdastuff.exceptions.UserException;
import tec.proyecto.guessdastuff.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    DateConverter dateConverter;

    @Autowired
    UserConverter userConverter;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JavaMailSender mailSender;

    @Autowired
    CloudinaryService cloudinaryService;

    @Value("${base.url}") String baseUrl;

    public DtoUserResponse findUserByUsername(String username) throws UserException{

        Optional<User> userOpt = userRepository.findByUsername(username);
        if(!userOpt.isPresent()){
            throw new UserException("El usuario " + username + " no existe!");
        }
        DtoUserResponse dtoUser = userConverter.toDtoResponse(userOpt.get());

        return dtoUser;
    }

    public List<DtoUserResponse> listUsers(){

        List<User> listUsers = userRepository.findAll();
        List<DtoUserResponse> dtoUsers = new ArrayList<>();

        for(User user : listUsers){
            dtoUsers.add(userConverter.toDtoResponse(user));
        }

        return dtoUsers;

    }

    public List<DtoUserResponse> listActiveUsers(){
        List<User> listUsers = userRepository.findAll().stream().filter(user -> user.getStatus().equals(EStatus.ONLINE)).toList();
        List<DtoUserResponse> dtoUsers = new ArrayList<>();

        for(User user : listUsers){
            dtoUsers.add(userConverter.toDtoResponse(user));
        }

        return dtoUsers;

    }

    public ResponseEntity<?> editUser(String username, DtoUserRequest dtoEditUser, MultipartFile file) throws UserException, IOException{

        Optional<User> userOpt = userRepository.findByUsername(username);
        if(!userOpt.isPresent()){
            throw new UserException("El usuario " + username + " no existe!");
        }

        User userEnt = userOpt.get();

        // Actualizar contraseña si se proporciona
        if (dtoEditUser.getPassword() != null && !dtoEditUser.getPassword().isBlank()) {
            userEnt.setPassword(passwordEncoder.encode(dtoEditUser.getPassword()));
        }

        // Si hay un archivo (imagen) que se recibe
        if (file != null && !file.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(file);
            userEnt.setUrlPerfil(imageUrl);
        }

        userRepository.save(userEnt);

        return ResponseEntity.ok("El usuario " + userEnt.getUsername() + " ha sido editado correctamente!");

    }
    
    public ResponseEntity<?> deleteUser(String username) throws UserException{
        Optional<User> userOpt = userRepository.findByUsername(username);
        if(!userOpt.isPresent()){
            throw new UserException("El usuario " + username + " no existe!");
        }

        User user = userOpt.get();
        user.setStatus(EStatus.DELETED);
        userRepository.save(user);

        return ResponseEntity.ok("El usuario " + username + " ha sido eliminado de forma exitosa!");
    }

    public ResponseEntity<?> addAdmin (DtoAdmin dtoAdmin) throws UserException{

        Optional<User> userOpt = userRepository.findByUsername(dtoAdmin.getUsername());

        if(userOpt.isPresent()){
            throw new UserException("El admin " + dtoAdmin.getUsername() + " ya existe!");
        }

        User userBuild = User.builder()
            .username(dtoAdmin.getUsername())
            .password(passwordEncoder.encode(dtoAdmin.getPassword()))
            .email(dtoAdmin.getEmail())
            .role(ERole.ROLE_ADMIN)
            .status(EStatus.REGISTERED)
            .birthday(LocalDate.now()) // hardcoded
            .country("Uruguay")
            .build();

        userRepository.save(userBuild);

        return ResponseEntity.ok("El admin " + dtoAdmin.getUsername() + " ha sido creado de forma exitosa!");
    }

    // Genera un enlace de restablecimiento de contraseña y envía un correo electrónico
    public void processforgot_password(String email) throws UserException{
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            userRepository.save(user);

            String resetToken = token;
            sendResetPasswordEmail(user.getEmail(), resetToken);
        } else {
            throw new UserException("El usuario con el correo electrónico " + email + " no existe");
        }
    }

    // Envía el correo electrónico de restablecimiento de contraseña
    private void sendResetPasswordEmail(String to, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset Request");
        message.setText("Este es tu token para reestablecer la contraseña: " + resetToken);
        mailSender.send(message);
    }

    // Valida el token de restablecimiento de contraseña
    public boolean validatePasswordResetToken(String token) {
        return userRepository.findByResetToken(token).isPresent();
    }

    // Actualiza la contraseña del usuario
    public String updatePassword(String token, String newPassword)  {
        Optional<User> userOpt = userRepository.findByResetToken(token);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null); // Limpia el token después de usarlo
            userRepository.save(user);
            return "Token válido";
        } else {
            return "Token inválido";
        }
    }

    public ResponseEntity<?> blockUser(String username) throws UserException{
        Optional<User> userOpt = userRepository.findByUsername(username);
        if(!userOpt.isPresent()){
            throw new UserException("El usuario " + username + " no existe!");
        }

        User user = userOpt.get();
        user.setStatus(EStatus.BLOCKED);
        userRepository.save(user);

        return ResponseEntity.ok("El usuario " + username + " ha sido bloqueado de forma exitosa!");
    }

    public ResponseEntity<?> unblockUser(String username) throws UserException{
        Optional<User> userOpt = userRepository.findByUsername(username);
        if(!userOpt.isPresent()){
            throw new UserException("El usuario " + username + " no existe!");
        }

        User user = userOpt.get();
        if(!user.getStatus().equals(EStatus.BLOCKED)){
            throw new UserException("El usuario " + username + " no esta bloqueado!");
        }
        user.setStatus(EStatus.REGISTERED);
        userRepository.save(user);

        return ResponseEntity.ok("El usuario " + username + " ha sido desbloqueado de forma exitosa!");
    }

    public String getImageProfile(String username) throws UserException{
        Optional<User> userOpt = userRepository.findByUsername(username);
        return userOpt.get().getUrlPerfil();
    }
}
