package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tec.proyecto.guessdastuff.enums.ERole;
import tec.proyecto.guessdastuff.enums.EStatus;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoUserResponse {

    private String username;

    private String email;

    private String urlPerfil;

    private String country;

    private DtoDate birthday;

    private ERole role;

    private EStatus status;

}
