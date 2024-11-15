package tec.proyecto.guessdastuff.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.DestinationVariable;
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
import tec.proyecto.guessdastuff.dtos.DtoLoadGameRequest;
import tec.proyecto.guessdastuff.dtos.DtoLoadGameResponse;
import tec.proyecto.guessdastuff.dtos.DtoSendAnswer;
import tec.proyecto.guessdastuff.dtos.DtoSendAnswerResponse;
import tec.proyecto.guessdastuff.entitiesSocket.DtoImplementationGame;
import tec.proyecto.guessdastuff.services.MultiplayerService;
import tec.proyecto.guessdastuff.services.PlayService;

@CrossOrigin(origins = "http://localhost:8080/")
@RestController
@RequestMapping("/api/game-multi")
public class MultiplayerController {

    @Autowired
    private MultiplayerService multiplayerService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private PlayService playService;

    // Endpoint para crear una nueva partida
    @PostMapping("/v1/create/")
    public String createGame(@RequestBody DtoCreateMultiGameRequest dtoCreateMultiGameRequest) {
        String newGame = multiplayerService.createGame(dtoCreateMultiGameRequest);
        return newGame; // Retornar el ID del juego creado
    }

    //en multijugador el load game es via socket. LO EJECUTA SOLO EL HOST y le llega a ambos. 
    @MessageMapping("/game/{idSocket}/load-game/")
    public void createGameMulti(@Payload DtoLoadGameRequest dtoLoadGameRequest, @DestinationVariable String idSocket) {
        try {
            DtoLoadGameResponse ruleta = playService.loadGame(dtoLoadGameRequest);

            DtoImplementationGame response = new DtoImplementationGame();
            response.setStatus("INVITE_RULETA");
            response.setRuletaGame(ruleta);
            //avisarle a los otros jugadores
            messagingTemplate.convertAndSend("/game/" + idSocket + "/", response);
        } catch (Exception e) {
            messagingTemplate.convertAndSend("/game/" + idSocket + "/error", e.getMessage());
        }
    } 

    // SOCKET DONDE LOS USUARIOS PUBLICAN LAS RESPUESTAS
    // LOS MENSAJES DE ESTE ENDPOINT SOLO LOS ENTIENDE EL BACKEND
    @MessageMapping("/game/{idSocket}/play/")
    public void sendAnswer(@Payload DtoSendAnswer dtoSendAnswer, @DestinationVariable String idSocket) {
        try {
            DtoSendAnswerResponse msgUsersAll = new DtoSendAnswerResponse();
            msgUsersAll = multiplayerService.sendAnswer(dtoSendAnswer, idSocket);
            //avisarle a los otros jugadores
            messagingTemplate.convertAndSend("/game/" + idSocket + "/", msgUsersAll);
        } catch (Exception e) {
            messagingTemplate.convertAndSend("/game/" + idSocket + "/error", e.getMessage());
        }
    }

    // Endpoint para iniciar la partida
    @MessageMapping("/game/{idSocket}/start/")
    public void startGame(@DestinationVariable String idSocket, @Payload DtoInitGameMultiRequest dtoInitGameMultiRequest) {
        try {

            DtoInitGameMultiResponse implementation = multiplayerService.startGame(idSocket, dtoInitGameMultiRequest);

            DtoImplementationGame response = new DtoImplementationGame();
            response.setStatus("INVITE_IMPLEMENTATION");
            response.setImplementGame(implementation);

            messagingTemplate.convertAndSend("/game/" + idSocket + "/", response);
        } catch (Exception e) {
            messagingTemplate.convertAndSend("/game/" + idSocket + "/error", e.getMessage());
        }
    }

}
