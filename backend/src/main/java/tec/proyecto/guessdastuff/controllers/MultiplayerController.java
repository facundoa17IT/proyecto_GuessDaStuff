package tec.proyecto.guessdastuff.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tec.proyecto.guessdastuff.dtos.DtoCreateMultiGameRequest;
import tec.proyecto.guessdastuff.dtos.DtoSendAnswer;
import tec.proyecto.guessdastuff.entitiesSocket.SocketMatch;
import tec.proyecto.guessdastuff.services.MultiplayerService;

@CrossOrigin(origins = "http://localhost:8080/")
@RestController
@RequestMapping("/api/game-multi")
public class MultiplayerController {

    @Autowired
    private MultiplayerService multiplayerService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    // Endpoint para crear una nueva partida
    @PostMapping("/v1/create/")
    public String createGame(@RequestBody DtoCreateMultiGameRequest dtoCreateMultiGameRequest) {
        String newGame = multiplayerService.createGame(dtoCreateMultiGameRequest);
        return newGame; // Retornar el ID del juego creado
    }

    // SOCKET DONDE LOS USUARIOS PUBLICAN LAS RESPUESTAS
    // LOS MENSAJES DE ESTE ENDPOINT SOLO LOS ENTIENDE EL BACKEND
    @MessageMapping("/game/{idSocket}/play/")
    public void sendAnswer(@Payload DtoSendAnswer dtoSendAnswer) {
        multiplayerService.sendAnswer(dtoSendAnswer);
        String msgUsers = "se termino el recreo!";
        //avisarle a los otros jugadores
        messagingTemplate.convertAndSend("/game/{idSocket}/", msgUsers);
    }

}
