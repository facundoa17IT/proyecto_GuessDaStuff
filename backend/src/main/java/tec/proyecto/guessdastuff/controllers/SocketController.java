package tec.proyecto.guessdastuff.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import tec.proyecto.guessdastuff.entities.GameMessage;

@Controller
public class SocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public SocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
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
