package tec.proyecto.guessdastuff.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tec.proyecto.guessdastuff.dtos.*;
import tec.proyecto.guessdastuff.repositories.PlayRepository;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PlayService {

    @Autowired
    private PlayRepository playRepository;

    public DtoLoadGameResponse loadGame(DtoLoadGameRequest dtoLoadGameRequest) {
        List<Object[]> result = playRepository.loadGameByCategories(dtoLoadGameRequest.getCategories());
        
        Map<String, List<String>> categoriesMap = new HashMap<>();

        for (Object[] row : result) {
            String category = (String) row[0];
            String[] gameModesArray = (String[]) row[1];
            List<String> gameModes = Arrays.asList(gameModesArray);

            categoriesMap.put(category, gameModes);
        }

        return new DtoLoadGameResponse(categoriesMap);
    }
}
