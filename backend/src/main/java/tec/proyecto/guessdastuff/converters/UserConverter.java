package tec.proyecto.guessdastuff.converters;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import tec.proyecto.guessdastuff.dtos.DtoDate;
import tec.proyecto.guessdastuff.dtos.DtoUserResponse;
import tec.proyecto.guessdastuff.entities.User;

@Component
public class UserConverter {

    @Autowired
    PasswordEncoder passwordEncoder;
    
    public DtoUserResponse toDtoResponse(User user){
        DtoDate birthday = new DtoDate(user.getBirthday().getYear(), user.getBirthday().getMonthValue(), user.getBirthday().getDayOfMonth() );

        
        DtoUserResponse dtoUser = new DtoUserResponse(user.getUsername(), user.getEmail(), user.getUrlPerfil(), user.getCountry(), birthday);

        return dtoUser;
    }

}
