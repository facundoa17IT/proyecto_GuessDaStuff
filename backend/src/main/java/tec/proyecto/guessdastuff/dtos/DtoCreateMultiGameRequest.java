package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoCreateMultiGameRequest {

    private PlayerOnline userHost;
    private PlayerOnline userGuest;

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class PlayerOnline {
        private String username;
        private String userId;
    }

}
