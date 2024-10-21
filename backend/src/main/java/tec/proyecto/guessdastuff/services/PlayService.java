package tec.proyecto.guessdastuff.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tec.proyecto.guessdastuff.dtos.*;
import tec.proyecto.guessdastuff.repositories.PlayRepository;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

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
    
    public DtoInitGameResponse initGame(DtoInitGameRequest dtoInitGameRequest) {


    /*
        creo la estructura

        FOREACH (3){
         if mod = OBD buscar esa data y trabajarla para la respuesta{

            obtener los datos y trabajarlos puntualmente para cada modo de juego

            agrego a la estructura
            
         }
        else if mod = OW buscar esa data y trabajarla para la respuesta{
        
        }
        if mod = GP buscar esa data y trabajarla para la respuesta{
        
        }
        
        }


 
     */
   
        List<Object[]> result = playRepository.findGamesByCategoriesAndModes(
            dtoInitGameRequest.getCat1(), dtoInitGameRequest.getMod1(),
            dtoInitGameRequest.getCat2(), dtoInitGameRequest.getMod2(),
            dtoInitGameRequest.getCat3(), dtoInitGameRequest.getMod3()
        );

        Map<String, DtoInitGameResponse.GameModeInfo> gameModesMap = new HashMap<>();

        for (Object[] row : result) {
            String gameId = String.valueOf(row[0]); // Asegúrate de convertir correctamente
            String gameMode = (String) row[1];
            String category = (String) row[2];
            String event = (String) row[3];
            String hint1 = (String) row[4];
            String hint2 = (String) row[5];
            String hint3 = (String) row[6];
            String startDate = (String) row[7];
            String endDate = (String) row[8];
            String infoEvent = (String) row[9];

            DtoInitGameResponse.GameInfo gameInfo = new DtoInitGameResponse.GameInfo(
                gameId, gameMode, category, event, hint1, hint2, hint3, startDate, endDate, infoEvent
            );

            if (!gameModesMap.containsKey(gameMode)) {
                gameModesMap.put(gameMode, new DtoInitGameResponse.GameModeInfo(gameMode, category, new ArrayList<>()));
            }
            gameModesMap.get(gameMode).getInfoGame().add(gameInfo);
        }

        return new DtoInitGameResponse(gameModesMap);
    }
    


}
