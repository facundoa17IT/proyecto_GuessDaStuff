package tec.proyecto.guessdastuff.entitiesSocket;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tec.proyecto.guessdastuff.enums.EGameStatus;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SocketMatch {

    private PlayerOnline userHost;
    private PlayerOnline userGuest;
    private String idGame;
    private EGameStatus status = EGameStatus.CREATED;

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class PlayerOnline {
        private String username;
        private String userId;
    }

}
