package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoGuessPhrase {

    private String idGameMode;

    private Long id_Category;

    private String phrase;

    private String correctWord;

    private String hint1;

    private String hint2;

    private String hint3;

}