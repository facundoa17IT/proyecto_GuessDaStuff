package tec.proyecto.guessdastuff.dtos;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tec.proyecto.guessdastuff.entities.DataGameSingle;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoLoadPlaygameResponse {
    
    private Map<String, List<DataGameSingle>> Partidas;


}