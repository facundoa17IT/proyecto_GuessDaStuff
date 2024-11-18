package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoSendAnswerResponse {
    private String status; // FINISH_GAME FINISH_ROUND
    private String idUserWin;
    //GUID DE CADA JUEGO MULTIJUGADOR. SON 3. es un  que apunta guid() -> 1021 1022 1023
    private String idGameMulti;
    //ID DEL JUEGO PUNTUAL 1021 1022 1023 ... SIRVE ENVIARLO PARA OBTENER MAS RAPIDO DESDE EL BACK LA RESPUESTA
    private String idGame;


    private Boolean is_win;
    private Integer points;
}
