package tec.proyecto.guessdastuff.services;

import java.util.*;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import tec.proyecto.guessdastuff.converters.DateConverter;
import tec.proyecto.guessdastuff.converters.UserConverter;
import tec.proyecto.guessdastuff.dtos.DtoUser;
import tec.proyecto.guessdastuff.entities.User;
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

    public ResponseEntity<?> findUserByNickname(String username) throws UserException{

        Optional<User> userOpt = userRepository.findByUsername(username);
        if(!userOpt.isPresent()){
            throw new UserException("El usuario " + username + " no existe!");
        }

        DtoUser dtoUser = userConverter.toDto(userOpt.get());

        return ResponseEntity.ok(dtoUser);
    }

    public ResponseEntity<?> listUsers(){

        List<User> listUsers = userRepository.findAll();
        List<DtoUser> dtoUsers = new ArrayList<>();

        for(User user : listUsers){
            dtoUsers.add(userConverter.toDto(user));
        }

        return ResponseEntity.ok(dtoUsers);

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

}
