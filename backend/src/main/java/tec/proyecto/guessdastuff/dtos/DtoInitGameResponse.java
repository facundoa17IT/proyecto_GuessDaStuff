package tec.proyecto.guessdastuff.dtos;

import java.util.Map;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoInitGameResponse {

    private Map<String, GameModeInfo> gameModes;
    private String idGameSingle;

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    public static class GameModeInfo {
        private String name;
        private List<GameInfo> infoGame;
    }

    @NoArgsConstructor
    @AllArgsConstructor
    @Data
    @Builder
    public static class GameInfo {
        private String id;
        private String idModeGame;
        private String idCategory;
        private String randomCorrectWord;
        private String hint1;
        private String hint2;
        private String hint3;
        private String randomWord1;
        private String randomWord2;
        private String randomWord3;
        private String question;
        private String word;
        private String correct_word;
        private String phrase;

    }
}
