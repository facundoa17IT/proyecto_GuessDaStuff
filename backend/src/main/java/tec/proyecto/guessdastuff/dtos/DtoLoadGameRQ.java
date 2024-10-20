package tec.proyecto.guessdastuff.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoLoadGameRQ {
    
    private List<Integer> categories;
    
    private String modeGame;

}
