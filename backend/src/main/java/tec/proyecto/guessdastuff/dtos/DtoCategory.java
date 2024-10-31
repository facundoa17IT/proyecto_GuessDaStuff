package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tec.proyecto.guessdastuff.enums.ECategoryStatus;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoCategory {
    
    private String name;

    private String description;

    @Builder.Default
    private String urlIcon = "urlDoCategory";

    @Builder.Default 
    private ECategoryStatus status = ECategoryStatus.EMPTY;
}
