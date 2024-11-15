package tec.proyecto.guessdastuff.entitiesSocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoUserToUser {
    private String action; //INVITE, INVITE_RESPONSE, RESPONSE_IDGAME
    private String userIdHost; //INVITE, INVITE_RESPONSE, RESPONSE_IDGAME
    private String usernameHost; //INVITE, INVITE_RESPONSE, RESPONSE_IDGAME
    private String userIdGuest; //INVITE, INVITE_RESPONSE, RESPONSE_IDGAME
    private String usernameGuest; //INVITE, INVITE_RESPONSE, RESPONSE_IDGAME

    private String gameId; //RESPONSE_IDGAME

    // true si el receptor acepta la invitación
    private boolean accepted; // INVITE_RESPONSE, RESPONSE_IDGAME

    private String message;
}

