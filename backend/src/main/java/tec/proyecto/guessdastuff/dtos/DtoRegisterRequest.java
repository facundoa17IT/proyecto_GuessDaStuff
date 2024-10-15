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
    int role; // 0 = ROLE_USER | 1 = ROLE_ADMIN
}