package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoUser {

    private String username;

    private String password;

    private String email;

    private String urlPerfil;

    private String country;

    private DtoDate birthday;
}
