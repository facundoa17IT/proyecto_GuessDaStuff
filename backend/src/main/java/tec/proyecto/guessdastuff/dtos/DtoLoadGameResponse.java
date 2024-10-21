package tec.proyecto.guessdastuff.dtos;

import java.util.Map;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoLoadGameResponse {
    
    private Map<String, List<String>> categories; // Mapa que relaciona categorías con listas de modos de juego
}
