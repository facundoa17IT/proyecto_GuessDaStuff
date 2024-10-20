package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoOrderByDate {

    private Long id_Category;
    
    private String event;

    private String infoEvent;

    private DtoDate startDate;

    private DtoDate endDate;

    private String hint1;
   
    private String hint2;

    private String hint3;

}
