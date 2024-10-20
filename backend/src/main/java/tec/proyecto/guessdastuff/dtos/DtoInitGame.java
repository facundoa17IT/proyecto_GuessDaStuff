package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoInitGame {

    private String userId; // ID del usuario
    private String cat1;   // Categoría 1
    private String mod1;   // Modo de juego 1
    private String cat2;   // Categoría 2
    private String mod2;   // Modo de juego 2
    private String cat3;   // Categoría 3
    private String mod3;   // Modo de juego 3
}
