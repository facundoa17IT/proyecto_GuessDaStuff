package tec.proyecto.guessdastuff.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiRequest;
import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiResponse;
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
   /*  @MessageMapping("/game/{gameId}/{playerId}")
    @SendTo("/game/{gameId}/{playerId}")
    public GameMessage sendToPlayer(GameMessage message) {

        //ir al backend, hacer la magia y volver.

        return message; // Este mensaje se enviará a todos los suscriptores del canal de destino
    }


    // Publicar un mensaje en el canal del juego general
    //@MessageMapping("/game/{gameId}")
    @SendTo("/game/{gameId}")
    public GameMessage sendToGameChannel(GameMessage message) {
        return message; // Se envía a todos los suscriptores del canal de juego
    }*/

    @MessageMapping("/game/{gameId}/{playerId}/notify")
    public void sendToPlayer(@DestinationVariable String gameId, @DestinationVariable String playerId, GameMessage message) {
        messagingTemplate.convertAndSend("/game/" + gameId + "/" + playerId, message);
    }

    @MessageMapping("/game/{gameId}")
    public void sendToGameChannel(@DestinationVariable String gameId, GameMessage message) {
        messagingTemplate.convertAndSend("/game/" + gameId, message);
    }

    // Métodos para enviar mensajes a canales específicos (ejemplo para uso interno)
    public void sendMessageToPlayer(String gameId, String playerId, GameMessage message) {
        messagingTemplate.convertAndSend("/game/" + gameId + "/" + playerId, message);
    }

    public void sendMessageToGameChannel(String gameId, GameMessage message) {
        messagingTemplate.convertAndSend("/game/" + gameId, message);
    }


    @MessageMapping("/game/{gameId}/{playerId}/guess")
    public void processGuess(@DestinationVariable String gameId, @DestinationVariable String playerId, GameMessage message) {
        String correctAnswer = playMultiService.getCorrectAnswer(gameId); // Obtener la respuesta correcta

        if (message.getContent().equalsIgnoreCase(correctAnswer)) {
            GameMessage successMessage = new GameMessage(playerId, "¡Correcto! Has adivinado la respuesta.", "test");
            messagingTemplate.convertAndSend("/game/" + gameId, successMessage); // Notificar en canal de juego
            // Opcional: termina el juego
        } else {
            GameMessage feedbackMessage = new GameMessage("Sistema", "Respuesta incorrecta, intenta de nuevo.", "test");
            messagingTemplate.convertAndSend("/game/" + gameId + "/" + playerId, feedbackMessage); // Notificar solo al jugador
        }
    }

    @MessageMapping("/game/{gameId}/checkAnswer")
    public void checkAnswer(@DestinationVariable String gameId, @Payload GameMessage message) {
        String playerAnswer = message.getContent();
        String correctAnswer = playMultiService.getCorrectAnswer(gameId);

        GameMessage responseMessage = new GameMessage();
        responseMessage.setSender("System");

        if (playerAnswer.equalsIgnoreCase(correctAnswer)) {
            responseMessage.setContent("¡Respuesta correcta! " + message.getSender() + " ha ganado.");
            // Envía la notificación a ambos jugadores
            messagingTemplate.convertAndSend("/game/" + gameId, responseMessage);
        } else {
            responseMessage.setContent("Respuesta incorrecta. Sigue intentando, " + message.getSender() + "!");
            // Envía la notificación de error solo al jugador
            messagingTemplate.convertAndSend("/game/" + gameId + "/" + message.getSender(), responseMessage);
        }
    }


}
