package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoGamesOfPlayer {
    
    private String id_game;

    private String game1;

    private String game2;

    private String game3;

    private Integer points;

    private float time_playing;
    
    private String user_win;

}
