package tec.proyecto.guessdastuff.converters;

import org.springframework.stereotype.Component;
import java.time.LocalDate;
import tec.proyecto.guessdastuff.dtos.DtoDate;

@Component
public class DateConverter {

    public LocalDate toLocalDate (DtoDate dtoDate){
        return LocalDate.of(dtoDate.getAnio(), dtoDate.getMes(), dtoDate.getDia());
    }
    
}
