package tec.proyecto.guessdastuff.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoDataGameSingle {
    private String id;

    private String idUser;

    private String idDataGame1;

    private String idDataGame2;  

    private String idDataGame3;  

    private int points;  
    
    private float timePlaying;

    private LocalDateTime tmstmpInit;

    private LocalDateTime tmstmpUpdate;

    private boolean isFinish;  
}

