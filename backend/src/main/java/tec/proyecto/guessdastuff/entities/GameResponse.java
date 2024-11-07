package tec.proyecto.guessdastuff.entities;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class GameResponse {

    private String question; // La pregunta a responder
    private List<String> options; // Opciones de respuesta
    private String correctAnswer; // La respuesta correcta


}
