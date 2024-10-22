package tec.proyecto.guessdastuff.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tec.proyecto.guessdastuff.dtos.*;
import tec.proyecto.guessdastuff.dtos.DtoInitGameRequest.ParCatMod;
import tec.proyecto.guessdastuff.dtos.DtoInitGameResponse.GameInfo;
import tec.proyecto.guessdastuff.dtos.DtoInitGameResponse.GameModeInfo;
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
    
        // Mapa que contendrá los modos de juego con su respectiva información
        Map<String, GameModeInfo> responseIntGame = new HashMap<>();
        String keyGame = "juego_";
        int count = 1;
        for (ParCatMod parCatMod : parCatModeList) {
            switch (parCatMod.getMod()) {
                case "OBD":
                    // Obtener los datos desde el repositorio
                    List<Object[]> responseObd = playRepository.findOBD(parCatMod.getCat());
                    // Crear una lista de GameInfo para almacenar la información
                    List<GameInfo> gameInfoList = new ArrayList<>(); 
                    for (Object[] itemObd : responseObd) {
                        GameInfo gameInfo = GameInfo.builder()
                            .id(String.valueOf(itemObd[2])) // Convertir el Long a String
                            .idModeGame((String) itemObd[10]) // idModeGame
                            .idCategory(String.valueOf(itemObd[3])) // idCategory
                            .event((String) itemObd[6]) // event
                            .hint1((String) itemObd[7]) // hint1
                            .hint2((String) itemObd[8]) // hint2
                            .hint3((String) itemObd[9]) // hint3
                            .startDate(itemObd[1].toString()) // Convertir Date a String (startDate)
                            .endDate(itemObd[0].toString()) // Convertir Date a String (endDate)
                            .infoEvent((String) itemObd[11]) // infoEvent
                            .build();
                    
                        // Añadir el objeto a la lista de GameInfo
                        gameInfoList.add(gameInfo);
                    }
                    // Crear el objeto GameModeInfo con la lista de GameInfo
                    GameModeInfo gameModeInfo = new GameModeInfo(
                        "Order By Date", gameInfoList
                    );
                    // Añadir el GameModeInfo al mapa de respuesta
                    responseIntGame.put(keyGame+count, gameModeInfo);
                    break;
                case "OW":
                    // Obtener los datos desde el repositorio
                    List<Object[]> responseOw = playRepository.findOW(parCatMod.getCat());
                    
                    if (!responseOw.isEmpty()) {
                        Object[] row = responseOw.get(0); // Obtener la primera fila de resultados
                        
                        // Crear una lista de GameInfo para almacenar la información
                        GameInfo gameInfo2 = GameInfo.builder()
                            .id(String.valueOf(row[2])) // Convertir el Long a String
                            .idModeGame((String) row[10]) // idModeGame
                            .idCategory(String.valueOf(row[3])) // idCategory
                            .event((String) row[6]) // event
                            .hint1((String) row[7]) // hint1
                            .hint2((String) row[8]) // hint2
                            .hint3((String) row[9]) // hint3
                            .word((String) row[13])
                            .build();
                        List<GameInfo> gameInfoList2 = new ArrayList<>(); 
                        gameInfoList2.add(gameInfo2);

                        // Crear el objeto GameModeInfo con la lista de GameInfo
                        GameModeInfo gameModeInfo2 = new GameModeInfo("Order Word", gameInfoList2);
                        // Añadir el GameModeInfo al mapa de respuesta
                        responseIntGame.put(keyGame+count, gameModeInfo2);
                    }
                    break;
                case "GP":
                    // Obtener los datos desde el repositorio
                    List<Object[]> responseGp = playRepository.findGP(parCatMod.getCat());
    
                    if (!responseGp.isEmpty()) {
                        Object[] row = responseGp.get(0); // Obtener la primera fila de resultados
                        
                        // Crear una lista de GameInfo para almacenar la información
                        GameInfo gameInfo3 = GameInfo.builder()
                            .id(String.valueOf(row[2])) // Convertir el Long a String
                            .idModeGame((String) row[10]) // idModeGame
                            .idCategory(String.valueOf(row[3])) // idCategory
                            .event((String) row[6]) // event
                            .hint1((String) row[7]) // hint1
                            .hint2((String) row[8]) // hint2
                            .hint3((String) row[9]) // hint3
                            .word((String) row[13])
                            .build();
                        List<GameInfo> gameInfoList3 = new ArrayList<>(); 
                        gameInfoList3.add(gameInfo3);

                        // Crear el objeto GameModeInfo con la lista de GameInfo
                        GameModeInfo gameModeInfo3 = new GameModeInfo("Guess Phrase", gameInfoList3);
                        // Añadir el GameModeInfo al mapa de respuesta
                        responseIntGame.put(keyGame+count, gameModeInfo3);
                    }
                    break;
                default:
                    break;  
                }
                count++;
        }
    
        // Crear la respuesta y asignar el mapa de modos de juego
        DtoInitGameResponse dtoInitGameResponse = new DtoInitGameResponse();
        dtoInitGameResponse.setGameModes(responseIntGame);
    
        return dtoInitGameResponse;
    }
}
