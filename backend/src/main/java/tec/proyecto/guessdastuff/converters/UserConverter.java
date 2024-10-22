package tec.proyecto.guessdastuff.converters;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import tec.proyecto.guessdastuff.dtos.DtoDate;
import tec.proyecto.guessdastuff.dtos.DtoUser;
import tec.proyecto.guessdastuff.entities.User;

@Component
public class UserConverter {

    @Autowired
    PasswordEncoder passwordEncoder;
    
    public DtoUser toDto(User user){
        DtoDate birthday = new DtoDate(user.getBirthday().getYear(), user.getBirthday().getMonthValue(), user.getBirthday().getDayOfMonth() );
        String password = passwordEncoder.encode(user.getPassword());
        
        DtoUser dtoUser = new DtoUser(user.getUsername(), password, user.getEmail(), user.getUrlPerfil(), user.getCountry(), birthday);

        return dtoUser;
    }

}
