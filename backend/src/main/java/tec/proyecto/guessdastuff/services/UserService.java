package tec.proyecto.guessdastuff.services;

import java.util.*;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import tec.proyecto.guessdastuff.converters.DateConverter;
import tec.proyecto.guessdastuff.converters.UserConverter;
import tec.proyecto.guessdastuff.dtos.DtoUser;
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

    public ResponseEntity<?> editUser(DtoUser dtoEditUser) throws UserException{

        Optional<User> userOpt = userRepository.findByUsername(dtoEditUser.getUsername());
        if(!userOpt.isPresent()){
            throw new UserException("El usuario " + dtoEditUser.getUsername() + " no existe!");
        }

        User userEnt = userOpt.get();

        LocalDate birthday = dateConverter.toLocalDate(dtoEditUser.getBirthday());

        userEnt.setEmail(dtoEditUser.getEmail());
        userEnt.setPassword(passwordEncoder.encode(dtoEditUser.getPassword()));
        userEnt.setUrlPerfil(dtoEditUser.getUrlPerfil());
        userEnt.setCountry(dtoEditUser.getCountry());
        userEnt.setBirthday(birthday);
        userEnt.setAtUpdate(LocalDate.now());

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

    public ResponseEntity<?> addAdmin (DtoUser dtoUser) throws UserException{

        Optional<User> userOpt = userRepository.findByUsername(dtoUser.getUsername());

        if(userOpt.isPresent()){
            throw new UserException("El admin " + dtoUser.getUsername() + " ya existe!");
        }

        LocalDate birthdate = dateConverter.toLocalDate(dtoUser.getBirthday());
        User userBuild = User.builder()
            .username(dtoUser.getUsername())
            .password(passwordEncoder.encode(dtoUser.getPassword()))
            .email(dtoUser.getEmail())
            .role(ERole.ROLE_ADMIN)
            .urlPerfil(dtoUser.getUrlPerfil())
            .country(dtoUser.getCountry())
            .birthday(birthdate)
            .status(EStatus.REGISTERED)
            .atCreate(LocalDate.now())
            .atUpdate(LocalDate.now())
            .build();

        userRepository.save(userBuild);

        return ResponseEntity.ok("El admin " + dtoUser.getUsername() + " ha sido creado de forma exitosa!");
    }

    // Genera un enlace de restablecimiento de contraseña y envía un correo electrónico
    public void processforgot_password(String email) throws UserException{
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            userRepository.save(user);

            String resetUrl = "http://localhost:8080/auth/reset-password?token=" + token; // Luego modificar x la url correcta
            sendResetPasswordEmail(user.getEmail(), resetUrl);
        } else {
            throw new UserException("El usuario con el correo electrónico " + email + " no existe");
        }
    }

    // Envía el correo electrónico de restablecimiento de contraseña
    private void sendResetPasswordEmail(String to, String resetUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset Request");
        message.setText("Click the link to reset your password: " + resetUrl);
        mailSender.send(message);
    }

    // Valida el token de restablecimiento de contraseña
    public boolean validatePasswordResetToken(String token) {
        return userRepository.findByResetToken(token).isPresent();
    }

    // Actualiza la contraseña del usuario
    public String updatePassword(String token, String newPassword)  {
        Optional<User> userOpt = userRepository.findByResetToken(token);
        System.out.println(userOpt);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null); // Limpia el token después de usarlo
            user.setAtUpdate(LocalDate.now());
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

}
