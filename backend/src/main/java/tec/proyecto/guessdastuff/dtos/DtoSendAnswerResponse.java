package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoSendAnswerResponse {

    private Boolean is_win;
    private String idUserWin;

    //GUID DE CADA JUEGO MULTIJUGADOR. SON 3. 
    private String idGameMulti;
    //ID DEL JUEGO PUNTUAL 1021 1022 1023 ... SIRVE ENVIARLO PARA OBTENER MAS RAPIDO DESDE EL BACK LA RESPUESTA
    private Integer idGame;

}
