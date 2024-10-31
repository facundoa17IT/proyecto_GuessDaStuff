package tec.proyecto.guessdastuff.dtos;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoListTitlesResponse {
    
    private Map<String, List<DtoTitleWithId>> titlesOfCategory;
    
}
