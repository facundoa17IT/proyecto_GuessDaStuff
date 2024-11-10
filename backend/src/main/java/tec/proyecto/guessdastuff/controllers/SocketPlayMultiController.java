package tec.proyecto.guessdastuff.controllers;

import java.net.Socket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiRequest;
import tec.proyecto.guessdastuff.dtos.DtoInitGameMultiResponse;
import tec.proyecto.guessdastuff.entities.GameMessage;
import tec.proyecto.guessdastuff.entitiesSocket.GameAnswer;
import tec.proyecto.guessdastuff.entitiesSocket.GameInvitationResponse;
import tec.proyecto.guessdastuff.entitiesSocket.GameInvite;
import tec.proyecto.guessdastuff.entitiesSocket.GameStatusUpdate;
import tec.proyecto.guessdastuff.entitiesSocket.SocketMatch;
import tec.proyecto.guessdastuff.entitiesSocket.SocketMatch.PlayerOnline;
import tec.proyecto.guessdastuff.enums.EGameStatus;
import tec.proyecto.guessdastuff.services.PlayMultiService;
import tec.proyecto.guessdastuff.services.SocketPlayMultiService;

@CrossOrigin(origins = "http://localhost:8080/")
//@CrossOrigin(origins = "http://localhost:5173/")
//@PreAuthorize("hasRole('USER')")
@RestController
@RequestMapping("/api/game-multi")
public class SocketPlayMultiController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private PlayMultiService playMultiService;
    @Autowired
    private SocketPlayMultiService socketPlayMultiService;

    // Endpoint para crear una nueva partida
    @PostMapping("/v1/create/{userId}")
    public String createGame(@PathVariable String userId) {
        String newGame = playMultiService.createGame(userId);
        return newGame; // Retornar el ID del juego creado
    }
    // SOCKET 
    @MessageMapping("/game/create")
    public void createGame(@Payload SocketMatch socketMatch) {
        SocketMatch game = socketPlayMultiService.createGame(socketMatch.getIdGame(), socketMatch.getUserHost().getUserId(), socketMatch.getUserHost().getUsername());
        messagingTemplate.convertAndSend("/topic/global", game);
    }

    // Endpoint para invitar a un amigo
    @PostMapping("/v1/invite/{gameId}/")
    public String inviteFriend(@PathVariable String gameId, @RequestParam String idUser, @RequestParam String friendEmail) {
        // Lógica para enviar la invitación al amigo
        PlayerOnline player = new PlayerOnline("PEPE", "1005");
        SocketMatch response = socketPlayMultiService.addPlayerToGame(gameId, player);
        return "Data SocketMatch : " + response;
    }
    // SOCKET
    @MessageMapping("/game/{gameId}/invite")
    public void invitePlayer(@Payload GameInvite invite) {
        messagingTemplate.convertAndSendToUser(invite.getToPlayerId(), "/queue/invites", invite);
    }

    // @MessageMapping("/invite")
    // public void sendInvitation(@Payload String userHost, @Payload String userReceiver) {
    //     //String recipient = invitation.getRecipient();
    //     messagingTemplate.convertAndSend("/game/invitations/" + userReceiver, "se realizado la invitacion!");
    // }

    // Nueva funcionalidad: Enviar respuesta de invitación
    @MessageMapping("/respond")
    public void respondToInvitation(GameInvitationResponse response) {
        messagingTemplate.convertAndSend("/game/invitations/responses/" + response.getHost(), response);

        // Si la respuesta es aceptada, también enviar un mensaje para redirigir a game.html
        // if (response.isAccepted()) {
        //    // GameInvitation invitation = new GameInvitation(response.getSender(), response.getRecipient());
        //     messagingTemplate.convertAndSend("/game/start/" + response.getSender() , response);
        //     messagingTemplate.convertAndSend("/game/start/" + response.getRecipient() , response);

        // }
    }

    @MessageMapping("/invite/{recipientUsername}")
    public void sendInvitation(@DestinationVariable String recipientUsername, GameInvite invitation) {
        // Envía la invitación al canal específico del destinatario
        messagingTemplate.convertAndSend("/game/invitations/" + recipientUsername, invitation);
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
/*----------------------------------------------------------------------*/



/* 
    @MessageMapping("/game/{gameId}/join")
    public void joinGame(@Payload InitGame player) {
        SocketGame game = socketPlayMultiService.addPlayerToGame(gameId, player);
        messagingTemplate.convertAndSend("/topic/game/" + gameId, game);
    }
*/
    @MessageMapping("/game/{gameId}/start")
    @SendTo("/topic/game/{gameId}")
    public SocketMatch startGame(@Payload String gameId) {
        return socketPlayMultiService.getGame(gameId).map(game -> {
            game.setStatus(EGameStatus.STARTED);
            return game;
        }).orElse(null);
    }

    @MessageMapping("/game/{gameId}/answer")
    public void handleAnswer(@Payload GameAnswer answer) {
        boolean isCorrect = socketPlayMultiService.validateAnswer(answer);
        messagingTemplate.convertAndSend("/topic/game/" + answer.getGameId() + "/status", 
                new GameStatusUpdate(answer.getPlayerId(), isCorrect));
    }




/*----------------------------------------------------------------------*/

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
