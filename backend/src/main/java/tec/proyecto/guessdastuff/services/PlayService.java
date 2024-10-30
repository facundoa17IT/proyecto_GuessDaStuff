package tec.proyecto.guessdastuff.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tec.proyecto.guessdastuff.dtos.*;
import tec.proyecto.guessdastuff.dtos.DtoInitGameRequest.ParCatMod;
import tec.proyecto.guessdastuff.dtos.DtoInitGameResponse.GameInfo;
import tec.proyecto.guessdastuff.dtos.DtoInitGameResponse.GameModeInfo;
import tec.proyecto.guessdastuff.repositories.DataGameSingleRepository;
import tec.proyecto.guessdastuff.repositories.PlayRepository;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.UUID;
import java.time.LocalDateTime;

import tec.proyecto.guessdastuff.entities.DataGameSingle;

@Service
public class PlayService {

    @Autowired
    private PlayRepository playRepository;

    @Autowired
    private DataGameSingleRepository dataGameSingleRepository;

    public boolean initPlayGame(String idGameSingle){
        dataGameSingleRepository.initPlayGame(idGameSingle);
    return true;
    }
    public boolean finishPlayGame(String idGameSingle){
        dataGameSingleRepository.finishPlayGame(idGameSingle);
    return true;
    }
    
   public boolean playGame(DtoPlayGameRequest dtoPlayGameRequest){
    //esto va a la tabla DataGame
    Object[] result = playRepository.getResultPlayGame(dtoPlayGameRequest.getIdGame());
    int points = 0;
    float timePlaying = dtoPlayGameRequest.getTime_playing(); // Obtener el tiempo de respuesta

    // Calcular puntos según el tiempo de respuesta
    if (timePlaying < 8) {
        points = 5;
    } else if (timePlaying < 15) {
        points = 4;
    } else if (timePlaying < 20) {
        points = 3;
    } else if (timePlaying < 25) {
        points = 2;
    } else if (timePlaying <= 30) {
        points = 1;
    }

    // Acceso unificado a los elementos del resultado
    Object[] resultArray = (Object[]) result[0]; // Unificar el acceso al array interno

    if (resultArray[10].equals("GP")){ // Asegúrate de que el índice sea correcto
        if (resultArray[7].equals(dtoPlayGameRequest.getResponse())){
            if (!dtoPlayGameRequest.getIdUser().equals("0")){ // Cambiar != por .equals
                // Actualizar la tabla data_game_single sumando puntos y tiempo de juego
                dataGameSingleRepository.updateDataGame(dtoPlayGameRequest.getIdGameSingle(), points, timePlaying);
            }
            return true;
        } else 
           return false;
    } else if (resultArray[10].equals("OW")){ // Asegúrate de que el índice sea correcto
        if (resultArray[5].equals(dtoPlayGameRequest.getResponse())){ // Asegúrate de que el índice sea correcto
            if (!dtoPlayGameRequest.getIdUser().equals("0")){ // Cambiar != por .equals
                // Actualizar la tabla data_game_single sumando puntos y tiempo de juego
                dataGameSingleRepository.updateDataGame(dtoPlayGameRequest.getIdGameSingle(), points, timePlaying);
            }
            return true;
        } else 
           return false;
    } else
    
    //si es incorrecto;
    return false; // Retornar false si es incorrecto
   }


   public DtoLoadGameResponse loadGame(DtoLoadGameRequest dtoLoadGameRequest) {
    List<Object[]> result = playRepository.loadGameByCategories(dtoLoadGameRequest.getCategories());
    
    // Lista para contener las categorías con sus modos de juego
    List<DtoLoadGameResponse.CategoryData> categoriesList = new ArrayList<>();

    for (Object[] row : result) {
        Long categoryId = ((Number) row[0]).longValue(); // ID de la categoría
        String categoryName = (String) row[1]; // Nombre de la categoría
        String[] gameModesArray = (String[]) row[2]; // Modos de juego como array
        
        // Convertimos el array de modos de juego a una lista de strings
        List<String> gameModes = Arrays.asList(gameModesArray);
        
        // Creamos un objeto CategoryData para la categoría actual
        DtoLoadGameResponse.CategoryData categoryData = new DtoLoadGameResponse.CategoryData(categoryId, categoryName, gameModes);
        
        // Añadimos el objeto a la lista
        categoriesList.add(categoryData);
    }

    // Retornamos la respuesta con la lista de categorías y sus modos de juego
    return new DtoLoadGameResponse(categoriesList);
}


    
    public DtoInitGameResponse initGame(DtoInitGameRequest dtoInitGameRequest) {

        List<ParCatMod> parCatModeList = dtoInitGameRequest.getParCatMod();
    
        // Mapa que contendrá los modos de juego con su respectiva información
        Map<String, GameModeInfo> responseIntGame = new HashMap<>();
        String keyGame = "juego_";
        int count = 1;

        // Variables para almacenar los IDs de los juegos
        String idGame1 = null;
        String idGame2 = null;
        String idGame3 = null;

        for (ParCatMod parCatMod : parCatModeList) {
            switch (parCatMod.getMod()) {
                case "OBD":
                    // Obtener los datos desde el repositorio
                    List<Object[]> responseObd = playRepository.findOBD(parCatMod.getCat());
                    // Crear una lista de GameInfo para almacenar la información
                    List<GameInfo> gameInfoList = new ArrayList<>(); 
                    StringBuilder ids = new StringBuilder(); // Usar StringBuilder para concatenar IDs

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
                        
                        // Concatenar el ID del juego
                        if (ids.length() > 0) {
                            ids.append(","); // Añadir una coma si ya hay IDs concatenados
                        }
                        ids.append(gameInfo.getId()); // Concatenar el ID
                    }

                    // Crear el objeto GameModeInfo con la lista de GameInfo
                    GameModeInfo gameModeInfo = new GameModeInfo("Order By Date", gameInfoList);
                    // Añadir el GameModeInfo al mapa de respuesta
                    responseIntGame.put(keyGame + count, gameModeInfo);
                    
                    // Asignar los IDs concatenados a las variables correspondientes
                    if (count == 1) {
                        idGame1 = ids.toString(); // Guardar la concatenación de IDs
                    } else if (count == 2) {
                        idGame2 = ids.toString(); // Guardar la concatenación de IDs
                    } else if (count == 3) {
                        idGame3 = ids.toString(); // Guardar la concatenación de IDs
                    }
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
                        responseIntGame.put(keyGame + count, gameModeInfo2);
                        // Asignar el id del juego según el valor de count
                        if (count == 1) {
                            idGame1 = gameInfo2.getId(); // Suponiendo que hay al menos un juego
                        } else if (count == 2) {
                            idGame2 = gameInfo2.getId(); // Suponiendo que hay al menos un juego
                        } else if (count == 3) {
                            idGame3 = gameInfo2.getId(); // Suponiendo que hay al menos un juego
                        }
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
                        responseIntGame.put(keyGame + count, gameModeInfo3);
                        // Asignar el id del juego según el valor de count
                        if (count == 1) {
                            idGame1 = gameInfo3.getId(); // Suponiendo que hay al menos un juego
                        } else if (count == 2) {
                            idGame2 = gameInfo3.getId(); // Suponiendo que hay al menos un juego
                        } else if (count == 3) {
                            idGame3 = gameInfo3.getId(); // Suponiendo que hay al menos un juego
                        }
                    }
                    break;
                default:
                    break;  
                }
                count++;
        }

        // Crear y guardar la tupla en la tabla DataGameSingle dentro del bucle
        DataGameSingle dataGameSingle = new DataGameSingle();
        dataGameSingle.setId(UUID.randomUUID().toString()); // Generar un ID único
        dataGameSingle.setIdUser(dtoInitGameRequest.getUserId()); // Asignar el ID del usuario
        dataGameSingle.setIdDataGame1(idGame1);
        dataGameSingle.setIdDataGame2(idGame2);
        dataGameSingle.setIdDataGame3(idGame3);
        dataGameSingle.setPoints(0); // Asignar puntos iniciales
        dataGameSingle.setTimePlaying(0); // Asignar tiempo inicial
        dataGameSingle.setTmstmpInit(LocalDateTime.now()); // Asignar timestamp actual
        dataGameSingle.setFinish(false); // Inicialmente no está terminado


        dataGameSingleRepository.save(dataGameSingle); 

        // Crear la respuesta y asignar el mapa de modos de juego
        DtoInitGameResponse dtoInitGameResponse = new DtoInitGameResponse();
        dtoInitGameResponse.setGameModes(responseIntGame);
        dtoInitGameResponse.setIdGameSingle(dataGameSingle.getId()); // Establecer el ID en la respuesta
    
        return dtoInitGameResponse;
    }
}
