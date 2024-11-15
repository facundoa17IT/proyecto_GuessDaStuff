package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoSendAnswer {
    private String idUserWin;
    // ID de la tabla InfoGameMulti
    private String idGameMulti;
    //ID del DataGame. 1021 1022 1023 ... SIRVE ENVIARLO PARA OBTENER MAS RAPIDO DESDE EL BACK LA RESPUESTA
    private String idGame;
    private float time_playing;
}
