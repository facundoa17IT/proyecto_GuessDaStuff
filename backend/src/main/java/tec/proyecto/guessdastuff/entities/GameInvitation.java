package tec.proyecto.guessdastuff.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class GameInvitation {
    
    private String sender;
    private String recipient;

}
