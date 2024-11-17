package tec.proyecto.guessdastuff.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tec.proyecto.guessdastuff.dtos.DtoCreateMultiGameRequest;
import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiRequest;
import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiResponse;
import tec.proyecto.guessdastuff.dtos.DtoLoadGameResponse;
import tec.proyecto.guessdastuff.dtos.DtoSendAnswer;
import tec.proyecto.guessdastuff.dtos.DtoSendAnswerResponse;
import tec.proyecto.guessdastuff.entitiesSocket.DtoImplementationGame;
import tec.proyecto.guessdastuff.services.MultiplayerService;
import tec.proyecto.guessdastuff.services.PlayMultiService;

@CrossOrigin(origins = "http://localhost:8080/")
@RestController
@RequestMapping("/api/game-multi")
public class MultiplayerController {

    @Autowired
    private MultiplayerService multiplayerService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private PlayMultiService playMultiService;

    // Endpoint para crear una nueva partida
    @PostMapping("/v1/create/")
    public String createGame(@RequestBody DtoCreateMultiGameRequest dtoCreateMultiGameRequest) {
        String newGame = multiplayerService.createGame(dtoCreateMultiGameRequest);
        return newGame; // Retornar el ID del juego creado
    }

    //en multijugador el load game es via socket. LO EJECUTA SOLO EL HOST y le llega a ambos. 
    @PostMapping("/game/{idSocket}/load-game/")
    public void createGameMulti(@RequestBody DtoLoadGameResponse dtoLoadGameResponse, @PathVariable String idSocket) {
        try {
            DtoImplementationGame response = new DtoImplementationGame();
            response.setStatus("INVITE_RULETA");
            response.setRuletaGame(dtoLoadGameResponse);
            response.setFinalSlot1(dtoLoadGameResponse.getFinalSlot1());
            response.setFinalSlot2(dtoLoadGameResponse.getFinalSlot2());
            response.setFinalSlot3(dtoLoadGameResponse.getFinalSlot3());

            //avisarle a los otros jugadores
            messagingTemplate.convertAndSend("/game/" + idSocket + "/", response);
        } catch (Exception e) {
            messagingTemplate.convertAndSend("/game/" + idSocket + "/error", e.getMessage());
        }
    } 

    // SOCKET DONDE LOS USUARIOS PUBLICAN LAS RESPUESTAS
    // LOS MENSAJES DE ESTE ENDPOINT SOLO LOS ENTIENDE EL BACKEND
    @PostMapping("/game/{idSocket}/play/")
    public void sendAnswer(@RequestBody DtoSendAnswer dtoSendAnswer, @PathVariable String idSocket) {
        try {
            DtoSendAnswerResponse msgUsersAll = multiplayerService.sendAnswer(dtoSendAnswer, idSocket);
            msgUsersAll.setStatus("FINISH_ROUND");
            //avisarle a los otros jugadores
            messagingTemplate.convertAndSend("/game/" + idSocket + "/", msgUsersAll);
        } catch (Exception e) {
            messagingTemplate.convertAndSend("/game/" + idSocket + "/error", e.getMessage());
        }
    }

    // Endpoint para iniciar la partida
    @PostMapping("/game/{idSocket}/start/")
    public void startGame(@PathVariable String idSocket, @RequestBody DtoInitGameMultiRequest dtoInitGameMultiRequest) {
        try {
            DtoInitGameMultiResponse implementation = playMultiService.startGame(idSocket, dtoInitGameMultiRequest);

            DtoImplementationGame response = new DtoImplementationGame();
            response.setStatus("INVITE_IMPLEMENTATION");
            response.setImplementGame(implementation);

            messagingTemplate.convertAndSend("/game/" + idSocket + "/", response);
        } catch (Exception e) {
            messagingTemplate.convertAndSend("/game/" + idSocket + "/error", e.getMessage());
        }
    }
}
