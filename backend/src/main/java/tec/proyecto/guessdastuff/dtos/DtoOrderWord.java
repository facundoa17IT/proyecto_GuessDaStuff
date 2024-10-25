package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoOrderWord {
    
    private String id_GameMode;

    private Long id_Category;

    private String word;

    private String hint1;

    private String hint2;

    private String hint3;

}