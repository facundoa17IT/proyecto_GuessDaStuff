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
    private String userIdGuest; //INVITE, INVITE_RESPONSE, RESPONSE_IDGAME

    private String gameId; //RESPONSE_IDGAME

    // true si el receptor acepta la invitación
    private boolean accepted; // INVITE_RESPONSE, RESPONSE_IDGAME

    private String message;
    private String implementGame; // al momento de ejecutar /game-multi/v1/start/{{ID_GAME_MULTI}}/ guardamos la respuesta aca para que el otro user tenga la misma data
}

