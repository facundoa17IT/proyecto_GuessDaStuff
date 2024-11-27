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
import tec.proyecto.guessdastuff.entities.Game;
import tec.proyecto.guessdastuff.entities.GuessPhrase;
import tec.proyecto.guessdastuff.entities.MultipleChoice;
import tec.proyecto.guessdastuff.entities.OrderWord;

@Service
public class PlayService {

    @Autowired
    private PlayRepository playRepository;

    @Autowired
    private DataGameSingleRepository dataGameSingleRepository;

    // SINGLEPLAYER
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
    Game result = playRepository.getResultPlayGame(dtoPlayGameRequest.getIdGame());
    int points = 0;
    float timePlaying = dtoPlayGameRequest.getTime_playing(); // Obtener el tiempo de respuesta

    if (timePlaying != 0){
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

        if ("GP".equals(result.getIdGameMode().getName())){ // Asegúrate de que el índice sea correcto
            GuessPhrase guessPhrase = (GuessPhrase) result;  
            if (guessPhrase.getCorrectWord().equals(dtoPlayGameRequest.getResponse())){
                // Actualizar la tabla data_game_single sumando puntos y tiempo de juego
                dataGameSingleRepository.updateDataGame(dtoPlayGameRequest.getIdGameSingle(), points, timePlaying);
                return true;
            } else 
            return false;
        } else if ("OW".equals(result.getIdGameMode().getName())){ // Asegúrate de que el índice sea correcto
            OrderWord orderWord = (OrderWord) result; 
            if (orderWord.getWord().equals(dtoPlayGameRequest.getResponse())){ // Asegúrate de que el índice sea correcto 
                // Actualizar la tabla data_game_single sumando puntos y tiempo de juego
                dataGameSingleRepository.updateDataGame(dtoPlayGameRequest.getIdGameSingle(), points, timePlaying);
                return true;
            } else 
            return false;
        } else if ("MC".equals(result.getIdGameMode().getName())){ // Asegúrate de que el índice sea correcto
            MultipleChoice multipleChoice = (MultipleChoice) result;
            if (multipleChoice.getRandomCorrectWord().equals(dtoPlayGameRequest.getResponse())){ // Asegúrate de que el índice sea correcto 
                // Actualizar la tabla data_game_single sumando puntos y tiempo de juego
                dataGameSingleRepository.updateDataGame(dtoPlayGameRequest.getIdGameSingle(), points, timePlaying);
                return true;
            } else 
            return false;
        }
    } else {
        dataGameSingleRepository.updateDataGame(dtoPlayGameRequest.getIdGameSingle(), points, timePlaying);
        return true; //
    }
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
    return new DtoLoadGameResponse(categoriesList, null, null, null);
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
                case "MC":
                    // Obtener los datos desde el repositorio
                    MultipleChoice responseMc = playRepository.findMC(parCatMod.getCat());
                    
                    if (responseMc != null) {// Obtener la primera fila de resultados
                        // Crear una lista de GameInfo para almacenar la información
                        GameInfo gameInfo = GameInfo.builder()
                            .id(responseMc.getId().toString()) // Convertir el Long a String
                            .idModeGame(responseMc.getIdGameMode().getName()) // idModeGame
                            .idCategory(responseMc.getIdCategory().getId().toString()) // idCategory
                            .hint1(responseMc.getHint1()) // hint1
                            .hint2(responseMc.getHint2()) // hint2
                            .hint3(responseMc.getHint3()) // hint3
                            .randomCorrectWord(responseMc.getRandomCorrectWord())
                            .randomWord1(responseMc.getRandomWord1())
                            .randomWord2(responseMc.getRandomWord2())
                            .randomWord3(responseMc.getRandomWord3())
                            .question(responseMc.getQuestion())
                            .build();
                        List<GameInfo> gameInfoList1 = new ArrayList<>(); 
                        gameInfoList1.add(gameInfo);

                        // Crear el objeto GameModeInfo con la lista de GameInfo
                        GameModeInfo gameModeInfo1 = new GameModeInfo("Multiple Choice", gameInfoList1);
                        // Añadir el GameModeInfo al mapa de respuesta
                        responseIntGame.put(keyGame + count, gameModeInfo1);
                        // Asignar el id del juego según el valor de count
                        if (count == 1) {
                            idGame1 = gameInfo.getId(); // Suponiendo que hay al menos un juego
                        } else if (count == 2) {
                            idGame2 = gameInfo.getId(); // Suponiendo que hay al menos un juego
                        } else if (count == 3) {
                            idGame3 = gameInfo.getId(); // Suponiendo que hay al menos un juego
                        }
                    }
                    break;
                case "OW":
                    // Obtener los datos desde el repositorio
                    OrderWord responseOw = playRepository.findOW(parCatMod.getCat());
                    
                    if (responseOw != null) {

                        // Crear una lista de GameInfo para almacenar la información
                        GameInfo gameInfo2 = GameInfo.builder()
                            .id(responseOw.getId().toString()) // Convertir el Long a String
                            .idModeGame(responseOw.getIdGameMode().getName()) // idModeGame
                            .idCategory(responseOw.getIdCategory().getId().toString()) // idCategory
                            .hint1(responseOw.getHint1()) // hint1
                            .hint2(responseOw.getHint2()) // hint2
                            .hint3(responseOw.getHint3()) // hint3
                            .word(responseOw.getWord())
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
                    GuessPhrase responseGp = playRepository.findGP(parCatMod.getCat());
    
                    if (responseGp !=  null) {
                        
                        // Crear una lista de GameInfo para almacenar la información
                        GameInfo gameInfo3 = GameInfo.builder()
                            .id(responseGp.getId().toString()) // Convertir el Long a String
                            .idModeGame(responseGp.getIdGameMode().getName()) // idModeGame
                            .idCategory(responseGp.getIdCategory().getId().toString()) // idCategory
                            .hint1(responseGp.getHint1()) // hint1
                            .hint2(responseGp.getHint2()) // hint2
                            .hint3(responseGp.getHint3()) // hint3
                            .correct_word(responseGp.getCorrectWord())
                            .phrase(responseGp.getPhrase())
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

    public DtoDataGameSingle getResumeGame(String idGame){
        DataGameSingle dataGameSingle = dataGameSingleRepository.getResumeGame(idGame);
        DtoDataGameSingle resume = new DtoDataGameSingle();

        // Asignar los valores directamente desde el objeto DataGameSingle
        resume.setId(dataGameSingle.getId());
        resume.setIdUser(dataGameSingle.getIdUser());
        resume.setIdDataGame1(dataGameSingle.getIdDataGame1());
        resume.setIdDataGame2(dataGameSingle.getIdDataGame2());
        resume.setIdDataGame3(dataGameSingle.getIdDataGame3());
        resume.setPoints(dataGameSingle.getPoints());
        resume.setTimePlaying(dataGameSingle.getTimePlaying());
        resume.setTmstmpInit(dataGameSingle.getTmstmpInit());
        resume.setTmstmpUpdate(dataGameSingle.getTmstmpUpdate());
        resume.setFinish(dataGameSingle.isFinish());
        return resume;
    }
}
