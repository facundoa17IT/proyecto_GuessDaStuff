package tec.proyecto.guessdastuff.entitiesSocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiResponse;
import tec.proyecto.guessdastuff.dtos.DtoLoadGameResponse;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoImplementationGame {
    private String status; //// INVITE_RULETA, // INVITE_IMPLEMENTATION
    private DtoLoadGameResponse ruletaGame; // INVITE_RULETA
    private DtoInitGameMultiResponse implementGame; // INVITE_IMPLEMENTATION
    private String finalSlot1;
    private String finalSlot2;
    private String finalSlot3;
}
