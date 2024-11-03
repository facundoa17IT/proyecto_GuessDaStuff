package tec.proyecto.guessdastuff.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiRequest;
import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiResponse;
import tec.proyecto.guessdastuff.dtos.DtoInitGameRequest;
import tec.proyecto.guessdastuff.dtos.DtoInitGameResponse;
import tec.proyecto.guessdastuff.entities.GameMessage;
import tec.proyecto.guessdastuff.services.PlayMultiService;

@CrossOrigin(origins = "http://localhost:8080/")
//@CrossOrigin(origins = "http://localhost:5173/")
//@PreAuthorize("hasRole('USER')")
@RestController
@RequestMapping("/api/game-multi")
public class SocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final PlayMultiService playMultiService;

    public SocketController(SimpMessagingTemplate messagingTemplate, PlayMultiService playMultiService) {
        this.messagingTemplate = messagingTemplate;
        this.playMultiService = playMultiService;
    }

    // Endpoint para crear una nueva partida
    @PostMapping("/v1/create/{userId}")
    public String createGame(@PathVariable String userId) {
        String newGame = playMultiService.createGame(userId);
        return newGame; // Retornar el ID del juego creado
    }

    // Endpoint para invitar a un amigo
    @PostMapping("/v1/invite/{gameId}/")
    public String inviteFriend(@PathVariable String gameId, @RequestParam String idUser, @RequestParam String friendEmail) {
        // Lógica para enviar la invitación al amigo
        playMultiService.inviteFriend(idUser, gameId, friendEmail);
        return "Invitación enviada a " + friendEmail + " para el juego " + gameId;
    }

    // Endpoint para iniciar la partida
    @PostMapping("/v1/start/{gameId}/")
    public  ResponseEntity<DtoInitGameMultiResponse>  startGame(@PathVariable String gameId, @RequestBody DtoInitGameMultiRequest dtoInitGameMultiRequest) {
        try {
            DtoInitGameMultiResponse response = playMultiService.startGame(gameId, dtoInitGameMultiRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }


    // Terminar partida
    @PostMapping("/v1/finish-play-game/{idGameMulti}/{idUserWin}")
    public ResponseEntity<Boolean> finishPlayGame(@PathVariable String idGameMulti, @PathVariable String idUserWin) {
        try {
            Boolean response = playMultiService.finishPlayGame(idGameMulti, idUserWin);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }


    // Endpoint para manejar mensajes de jugador 1 a jugador 2 y viceversa
    @MessageMapping("/game/{gameId}/{playerId}")
    @SendTo("/game/{gameId}/{playerId}")
    public GameMessage sendToPlayer(GameMessage message) {
        return message; // Este mensaje se enviará a todos los suscriptores del canal de destino
    }

    // Publicar un mensaje en el canal del juego general
    @MessageMapping("/game/{gameId}")
    @SendTo("/game/{gameId}")
    public GameMessage sendToGameChannel(GameMessage message) {
        return message; // Se envía a todos los suscriptores del canal de juego
    }

    // Métodos para enviar mensajes a canales específicos (ejemplo para uso interno)
    public void sendMessageToPlayer(String gameId, String playerId, GameMessage message) {
        messagingTemplate.convertAndSend("/game/" + gameId + "/" + playerId, message);
    }

    public void sendMessageToGameChannel(String gameId, GameMessage message) {
        messagingTemplate.convertAndSend("/game/" + gameId, message);
    }
}
