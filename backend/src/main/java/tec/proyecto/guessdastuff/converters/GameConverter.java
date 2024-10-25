package tec.proyecto.guessdastuff.converters;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import tec.proyecto.guessdastuff.dtos.DtoDate;
import tec.proyecto.guessdastuff.dtos.DtoGuessPhrase;
import tec.proyecto.guessdastuff.dtos.DtoOrderByDate;
import tec.proyecto.guessdastuff.dtos.DtoOrderWord;
import tec.proyecto.guessdastuff.entities.GuessPhrase;
import tec.proyecto.guessdastuff.entities.OrderByDate;
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

    public DtoOrderByDate toDtoOrderByDate(OrderByDate obd){

        DtoDate startDate = dateConverter.tDtoDate(obd.getStartDate());
        DtoDate endDate = dateConverter.tDtoDate(obd.getEndDate());

        DtoOrderByDate dtoOrderByDate = new DtoOrderByDate(obd.getIdGameMode().getName(), obd.getIdCategory().getId(), obd.getEvent(), obd.getInfoEvent(), 
                                                           startDate, endDate, obd.getHint1(), obd.getHint2(), obd.getHint3());
        
        return dtoOrderByDate;
    }

}
