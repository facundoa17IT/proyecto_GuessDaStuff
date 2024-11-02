package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoUserRequest {

    private String password;

    @Builder.Default
    private String urlPerfil  = "urlDoMacaco";

}
