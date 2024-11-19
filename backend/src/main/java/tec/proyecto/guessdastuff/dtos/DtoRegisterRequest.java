package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DtoRegisterRequest {

    String username;

    String password;

    String email;
    
    @Builder.Default
    int role = 0;

    @Builder.Default
    private String urlPerfil = "urlDoMacaco";

    private String country;

    private DtoDate birthday;

}