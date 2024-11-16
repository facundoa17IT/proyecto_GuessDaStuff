package tec.proyecto.guessdastuff.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tec.proyecto.guessdastuff.dtos.DtoCreateMultiGameRequest;
import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiRequest;
import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiRequest.ParCatMod;
import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiResponse;
import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiResponse.GameInfo;
import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiResponse.GameModeInfo;
import tec.proyecto.guessdastuff.dtos.DtoSendAnswer;
import tec.proyecto.guessdastuff.dtos.DtoSendAnswerResponse;
import tec.proyecto.guessdastuff.entities.DataGameMulti;
import tec.proyecto.guessdastuff.entities.GuessPhrase;
import tec.proyecto.guessdastuff.entities.InfoGameMulti;
import tec.proyecto.guessdastuff.entities.InfoGameMultiId;
import tec.proyecto.guessdastuff.entities.MultipleChoice;
import tec.proyecto.guessdastuff.entities.OrderWord;
import tec.proyecto.guessdastuff.repositories.DataGameMultiRepository;
import tec.proyecto.guessdastuff.repositories.InfoGameMultiRepository;
import tec.proyecto.guessdastuff.repositories.PlayRepository;

@Service
public class MultiplayerService {
    @Autowired
    private DataGameMultiRepository dataGameMultiRepository;
    @Autowired
    private InfoGameMultiRepository infoGameMultiRepository;
    @Autowired
    private PlayRepository playRepository;
    
    public String createGame(DtoCreateMultiGameRequest dtoCreateMultiGameRequest) {
        DataGameMulti newDataGameMulti = new DataGameMulti();
        newDataGameMulti.setId(UUID.randomUUID().toString());
        newDataGameMulti.setIdUser1(dtoCreateMultiGameRequest.getUserHost().getUserId());
        newDataGameMulti.setIdUser2(dtoCreateMultiGameRequest.getUserGuest().getUserId());

        dataGameMultiRepository.save(newDataGameMulti);

        return newDataGameMulti.getId(); // Retornar el juego creado
    }
    // cuando llega aca sabemos que si viene un usuario es porque el mismo gano el juego. 
    // si el tiempo es mayor a 30 quiere decir que nadie gano. 
    public DtoSendAnswerResponse sendAnswer(DtoSendAnswer dtoSendAnswer, String idSocket) {
        int points = 0;
        float timePlaying = dtoSendAnswer.getTime_playing(); 

        DtoSendAnswerResponse dtoSendAnswerResponse = new DtoSendAnswerResponse();
        dtoSendAnswerResponse.setIdGame(dtoSendAnswer.getIdGame());
        dtoSendAnswerResponse.setIdGameMulti(dtoSendAnswer.getIdGameMulti());
        dtoSendAnswerResponse.setIs_win(false);
        if (timePlaying <= 30){
            if (timePlaying != 0){
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
            }
            dtoSendAnswerResponse.setIdUserWin(dtoSendAnswer.getIdUserWin());
            dtoSendAnswerResponse.setIs_win(true);
        }
        dtoSendAnswerResponse.setPoints(points);
        InfoGameMultiId infoGameMultiId = new InfoGameMultiId();
        infoGameMultiId.setId(dtoSendAnswer.getIdGameMulti());
        infoGameMultiId.setIdDataGame(dtoSendAnswer.getIdGame());
        infoGameMultiRepository.updateDataGame(infoGameMultiId, dtoSendAnswer.getIdUserWin(), points, timePlaying);
        
    return dtoSendAnswerResponse;
    }
     // Iniciar la partida
    public DtoInitGameMultiResponse startGame(String gameId, DtoInitGameMultiRequest dtoInitGameMultiRequest){


        List<ParCatMod> parCatModeList = dtoInitGameMultiRequest.getParCatMod();
    
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
        Optional<DataGameMulti> optionalGame = dataGameMultiRepository.findById(gameId);

        String idInfoGame = UUID.randomUUID().toString();

        DataGameMulti dataGameMulti = optionalGame.get();

        for (String id : Arrays.asList(idGame1, idGame2, idGame3)) {
            InfoGameMultiId infoGameMultiId = new InfoGameMultiId();
            InfoGameMulti infoGameMulti = new InfoGameMulti();
            infoGameMultiId.setId(idInfoGame);
            infoGameMultiId.setIdDataGame(id);
            infoGameMulti.setInfoGameMultiId(infoGameMultiId);
            infoGameMultiRepository.save(infoGameMulti);
            infoGameMultiId = null;
        }

        // Crear la respuesta y asignar el mapa de modos de juego
        DtoInitGameMultiResponse dtoInitGameResponse = new DtoInitGameMultiResponse();
        dtoInitGameResponse.setGameModes(responseIntGame);
        dtoInitGameResponse.setIdGameMulti(gameId);
        dtoInitGameResponse.setIdUserFriend(dataGameMulti.getIdUser2());
        dtoInitGameResponse.setIdUserHost(dataGameMulti.getIdUser1());
        dataGameMulti.setIdInfoGameMulti(idInfoGame); 
        dataGameMultiRepository.save(dataGameMulti);
        return dtoInitGameResponse;

    }
    
}
