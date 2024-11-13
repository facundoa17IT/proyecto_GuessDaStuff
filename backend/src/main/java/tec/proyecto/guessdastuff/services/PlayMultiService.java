package tec.proyecto.guessdastuff.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiRequest;
import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiResponse;
import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiRequest.ParCatMod;
import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiResponse.GameInfo;
import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiResponse.GameModeInfo;

import tec.proyecto.guessdastuff.entities.DataGameMulti;
import tec.proyecto.guessdastuff.entities.MultipleChoice;
import tec.proyecto.guessdastuff.repositories.DataGameMultiRepository;
import tec.proyecto.guessdastuff.repositories.InfoGameMultiRepository;
import tec.proyecto.guessdastuff.repositories.PlayRepository;

import java.util.Arrays;
import java.util.ArrayList;
import tec.proyecto.guessdastuff.entities.GuessPhrase;
import tec.proyecto.guessdastuff.entities.InfoGameMulti;
import tec.proyecto.guessdastuff.entities.InfoGameMultiId;
import tec.proyecto.guessdastuff.entities.OrderWord;


@Service
public class PlayMultiService {

    @Autowired
    private DataGameMultiRepository dataGameMultiRepository;

    @Autowired
    private InfoGameMultiRepository  infoGameMultiRepository;

    @Autowired
    private PlayRepository playRepository;

     @Autowired
    private SimpMessagingTemplate messagingTemplate; // Inyectar SimpMessagingTemplate

    // MULTIPLAYER
    // Crear una nueva partida
    public String createGame(String idUser) {

        DataGameMulti newDataGameMulti = new DataGameMulti();
        newDataGameMulti.setId(UUID.randomUUID().toString());
        newDataGameMulti.setIdUser1(idUser);

        // Guardar en la base de datos
        DataGameMulti savedGame = dataGameMultiRepository.save(newDataGameMulti);

        // Crear el canal de socket para la nueva partida
        String gameChannel = "/game/" + savedGame.getId();
        messagingTemplate.convertAndSend(gameChannel, "Canal creado para la partida: " + savedGame.getId());

        return newDataGameMulti.getId(); // Retornar el juego creado
    }

    // Invitar a un amigo
    public boolean inviteFriend(String idUser, String id, String email) {
        Optional<DataGameMulti> optionalGame = dataGameMultiRepository.findById(id);
        
        if (optionalGame.isPresent()) {
            DataGameMulti dataGameMulti = optionalGame.get();
            
            // Verificar si ya hay un segundo usuario asignado
            if (dataGameMulti.getIdUser2() != null) {
                return false; // Ya hay un amigo invitado
            }

            // Asignar el segundo usuario
            dataGameMulti.setIdUser2(idUser);
            dataGameMultiRepository.save(dataGameMulti);

            // Enviar un mensaje al canal de WebSocket para notificar la invitación
            String gameChannel = "/game/7108d34b-de7b-4e51-b753-3b2387fc2c01";
            messagingTemplate.convertAndSend(gameChannel, "El usuario " + idUser + " ha sido invitado a la partida. Email: " + email);

            return true; // Retornar true si la invitación fue exitosa
        }

        return false; // Retornar false si no se encontró la partida
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
        // Enviar un mensaje al canal de WebSocket para notificar la invitación
        String gameChannel = "/game/7108d34b-de7b-4e51-b753-3b2387fc2c01";
        messagingTemplate.convertAndSend(gameChannel, "La partida ha sido configurada:");

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
    
    public boolean finishPlayGame(String idGameMulti, String idUserWin){
        dataGameMultiRepository.finishPlayGame(idUserWin, idGameMulti);
        return true;

      /*
        int puntosUser1 = 0;
        int puntosUser2 = 0;
        Optional<DataGameMulti> optionalGame = dataGameMultiRepository.findById(idGameMulti);
        
        // Manejo de excepciones si no se encuentra el juego
        if (optionalGame.isEmpty()) {
            return false; // Retornar false si no se encontró el juego
        }
        
        DataGameMulti dataGameMulti = optionalGame.get();

        if (dataGameMulti.getInfoGameMulti1().getIdUserWin().equals(dataGameMulti.getIdUser1())){
            puntosUser1 += dataGameMulti.getInfoGameMulti1().getPoints();
        } else {
            puntosUser2 += dataGameMulti.getInfoGameMulti1().getPoints();
        }
        if (dataGameMulti.getInfoGameMulti2().getIdUserWin().equals(dataGameMulti.getIdUser1())){
            puntosUser1 += dataGameMulti.getInfoGameMulti2().getPoints();
        } else {
            puntosUser2 += dataGameMulti.getInfoGameMulti2().getPoints();
        }
        if (dataGameMulti.getInfoGameMulti3().getIdUserWin().equals(dataGameMulti.getIdUser1())){
            puntosUser1 += dataGameMulti.getInfoGameMulti3().getPoints();
        } else {
            puntosUser2 += dataGameMulti.getInfoGameMulti3().getPoints();
        }
        if (puntosUser1 < puntosUser2){
            dataGameMultiRepository.finishPlayGame(dataGameMulti.getIdUser2(),idGameMulti);
            return true; 
        }else if (puntosUser1 > puntosUser2){
            dataGameMultiRepository.finishPlayGame(dataGameMulti.getIdUser1(), idGameMulti);
            return true; 
        } else {

            //CASO DE USO PARA EL TIRAR UNA MONEDA.
            return false; //empate
        }
             */
    }
    
    // Método para obtener la respuesta correcta de una partida
    public String getCorrectAnswer(String gameId) {
        // Simulación de recuperación de respuesta desde la base de datos o lógica de negocio
        // Puedes sustituir este código para obtener la respuesta desde PostgreSQL o tu sistema actual
        String correctAnswer = "respuesta_correcta";  // Ejemplo de respuesta
        return correctAnswer;
    }
    
    
}
