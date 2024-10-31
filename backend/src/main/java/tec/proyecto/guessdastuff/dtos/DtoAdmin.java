package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoAdmin {

    private String username;

    private String password;

    private String email;
}
