package tec.proyecto.guessdastuff.dtos;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoAllGamesIndividual {
    private String idGame;
    private String user;
    private String game1;
    private String game2;
    private String game3;
    private boolean isFinish;
    private Integer points;
    private float timePlaying;
    private String startDate;
}
