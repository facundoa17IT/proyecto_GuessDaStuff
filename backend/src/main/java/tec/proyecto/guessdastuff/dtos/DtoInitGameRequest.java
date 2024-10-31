package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoInitGameRequest {
    
    private String userId; // ID del usuario
    private List<ParCatMod> parCatMod; // Lista de ParCatMod

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class ParCatMod {
        private Integer cat;  
        private String mod;   
    }
}
