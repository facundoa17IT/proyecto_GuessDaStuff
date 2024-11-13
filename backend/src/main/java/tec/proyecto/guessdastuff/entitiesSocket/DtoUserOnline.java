package tec.proyecto.guessdastuff.entitiesSocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoUserOnline {

    private Long userId;
    private String username;
    private String email;
   
}
