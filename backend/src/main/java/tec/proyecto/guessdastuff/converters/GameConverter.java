package tec.proyecto.guessdastuff.converters;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tec.proyecto.guessdastuff.dtos.DtoGuessPhrase;
import tec.proyecto.guessdastuff.dtos.DtoMultipleChoice;
import tec.proyecto.guessdastuff.dtos.DtoOrderWord;
import tec.proyecto.guessdastuff.entities.GuessPhrase;
import tec.proyecto.guessdastuff.entities.MultipleChoice;
import tec.proyecto.guessdastuff.entities.OrderWord;

@Component
public class GameConverter {

    @Autowired
    DateConverter dateConverter;
    
    public DtoGuessPhrase toDtoGuessPhrase(GuessPhrase gp){

        DtoGuessPhrase dtoGuessPhrase = new DtoGuessPhrase(gp.getIdGameMode().getName(), gp.getIdCategory().getId(), gp.getPhrase(), gp.getCorrectWord(), 
                                                           gp.getHint1(), gp.getHint2(), gp.getHint3());
        return dtoGuessPhrase;
    }

    public DtoOrderWord toDtoOrderWord(OrderWord ow){

        DtoOrderWord dtoOrderWord = new DtoOrderWord(ow.getIdGameMode().getName(), ow.getIdCategory().getId(), ow.getWord(), ow.getHint1(), ow.getHint2(), ow.getHint3());
        return dtoOrderWord;
    }

    public DtoMultipleChoice toDtoMultipleChoice(MultipleChoice mC){

        DtoMultipleChoice dtoMultipleChoice = new DtoMultipleChoice(mC.getIdGameMode().getName(), mC.getIdCategory().getId(), mC.getRandomCorrectWord(), 
                                                                    mC.getRandomWord3(), mC.getRandomWord2(), mC.getRandomWord1(), mC.getHint1(), 
                                                                    mC.getHint2(), mC.getHint3(), mC.getQuestion());
        
        return dtoMultipleChoice;
    }

}
