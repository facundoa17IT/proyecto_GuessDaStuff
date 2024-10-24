package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoCategory {
    
    private String name;

    private String description;

    private String urlIcon;

    @Builder.Default
    private boolean active  = false;
}
