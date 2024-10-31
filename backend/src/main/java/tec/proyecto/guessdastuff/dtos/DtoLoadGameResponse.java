package tec.proyecto.guessdastuff.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoLoadGameResponse {

    private List<CategoryData> categories; // Lista de categorías con modos de juego

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    public static class CategoryData {
        private Long id;
        private String name;
        private List<String> gameModes;
    }

}
