package tec.proyecto.guessdastuff.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tec.proyecto.guessdastuff.dtos.*;
import tec.proyecto.guessdastuff.dtos.DtoInitGameRequest.ParCatMod;
import tec.proyecto.guessdastuff.dtos.DtoInitGameResponse.GameInfo;
import tec.proyecto.guessdastuff.dtos.DtoInitGameResponse.GameModeInfo;
import tec.proyecto.guessdastuff.entities.Game;
import tec.proyecto.guessdastuff.enums.EGameMode;
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
        
        
        List<ParCatMod> parCatModeList = dtoInitGameRequest.getParCatMod();

        Map<String, List<GameModeInfo>> responseIntGame = new HashMap<>();

        for (ParCatMod parCatMod : parCatModeList) {
            switch (parCatMod.getMod()) {
                case "OBD":
                    List<Object[]> responseObd = playRepository.findOBD( parCatMod.getCat());
                    List<GameInfo> gameInfoList;
                    for (Object[] itemObd : responseObd) {
                        
                        GameInfo gameInfo = GameInfo.builder()
                            .id((String)itemObd[2])
                            .idModeGame((String)itemObd[10])
                            .idCategory((String)itemObd[3])
                            .event((String)itemObd[6])
                            .hint1((String)itemObd[7])
                            .hint2((String)itemObd[8])
                            .hint3((String)itemObd[9])
                            .startDate((String)itemObd[1])
                            .endDate((String)itemObd[0])
                            .infoEvent((String)itemObd[11])
                            .build();
                            
                        gameInfoList.add(gameInfo);
                    }

                    responseIntGame.put("Order By Date", gameInfoList);
                    break;
                
                default:
                    playRepository.findRandomGame(parCatMod.getMod(), parCatMod.getCat());
                    
                    break;
            }
        }
        return new DtoInitGameResponse();
    }
    
}
