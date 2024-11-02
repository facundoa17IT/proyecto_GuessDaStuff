package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoMultipleChoice {

    private String idGameMode;

    private Long id_Category;
    
    private String randomCorrectWord;

    private String randomWord3;

    private String randomWord2;

    private String randomWord1;

    private String hint1;
   
    private String hint2;

    private String hint3;

    private String question;
}
