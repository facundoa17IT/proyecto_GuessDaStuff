package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoAllGames {
    
    private String id_game;
    private String user;
    private String user2;
    private String userWin;
    private String game1;
    private String game2;
    private String game3;
    private boolean isFinish;
    private Integer points;
    private float time_playing;
    
}
