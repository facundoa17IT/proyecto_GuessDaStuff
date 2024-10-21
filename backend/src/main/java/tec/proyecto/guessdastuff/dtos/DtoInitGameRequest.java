package tec.proyecto.guessdastuff.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoInitGameRequest {

    private String userId; // ID del usuario

    private parCatMod parCatMod1;  
    private parCatMod parCatMod2;  
    private parCatMod parCatMod3;   

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class  parCatMod {
        private Integer cat;  
        private String mod;   
    }
    
}

