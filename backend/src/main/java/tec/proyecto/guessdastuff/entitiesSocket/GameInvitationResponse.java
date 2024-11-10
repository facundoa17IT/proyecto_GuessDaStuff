package tec.proyecto.guessdastuff.entitiesSocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class GameInvitationResponse {
    private String host;
    private String guest;
    private boolean accepted; // true si el receptor acepta la invitación
    private String message;
}
