package tec.proyecto.guessdastuff.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class GameInvitationResponse {
    private String sender;
    private String recipient;
    private boolean accepted; // true si el receptor acepta la invitación
    private String message;
}
