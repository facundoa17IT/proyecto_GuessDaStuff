package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoUser {

    private String username;

    private String password;

    private String email;

    @Builder.Default
    private String urlPerfil  = "urlDelMacaco";

    private String country;

    private DtoDate birthday;
}
