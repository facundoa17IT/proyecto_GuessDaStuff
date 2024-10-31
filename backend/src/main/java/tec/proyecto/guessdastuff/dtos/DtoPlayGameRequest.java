package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoPlayGameRequest {

    private String idGameSingle;

    private String idUser;
    
    private String response;
    
    private Integer idGame;

    private float time_playing; //tiempo en segundos desde que inicio la partida

}
