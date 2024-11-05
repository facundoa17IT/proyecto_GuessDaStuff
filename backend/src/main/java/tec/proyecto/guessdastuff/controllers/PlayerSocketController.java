package tec.proyecto.guessdastuff.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.*;
import tec.proyecto.guessdastuff.entities.GameInvitation;
import tec.proyecto.guessdastuff.entities.GameInvitationResponse;
import tec.proyecto.guessdastuff.entities.GameResponse;

import java.util.*;

@CrossOrigin(origins = "http://localhost:8080/")
@RestController 
public class PlayerSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private Set<String> connectedPlayers;


    @PostConstruct
    public void init() {
        connectedPlayers = new HashSet<>();
    }

    @MessageMapping("/connect")
    public void connectPlayer(String username) {
        connectedPlayers.add(username);
        updatePlayerList();
    }

    @MessageMapping("/disconnect")
    public void disconnectPlayer(String username) {
        connectedPlayers.remove(username);
        updatePlayerList();
    }

    private void updatePlayerList() {
        // Cambia el canal a /game/activePlayers
        messagingTemplate.convertAndSend("/game/activePlayers", connectedPlayers);
    }

    // Nueva funcionalidad: Enviar notificación de invitación a un jugador
    @MessageMapping("/invite")
    public void sendInvitation(GameInvitation invitation) {
        String recipient = invitation.getRecipient();
        messagingTemplate.convertAndSend("/game/invitations/" + recipient, invitation);
    }

    // Nueva funcionalidad: Enviar respuesta de invitación
    @MessageMapping("/respond")
    public void respondToInvitation(GameInvitationResponse response) {
        messagingTemplate.convertAndSend("/game/invitations/responses/" + response.getSender(), response);

        // Si la respuesta es aceptada, también enviar un mensaje para redirigir a game.html
        if (response.isAccepted()) {
           // GameInvitation invitation = new GameInvitation(response.getSender(), response.getRecipient());
            messagingTemplate.convertAndSend("/game/start/" + response.getSender() , response);
            messagingTemplate.convertAndSend("/game/start/" + response.getRecipient() , response);
            
        }
    }

    @MessageMapping("/start")
    public void startGame(GameInvitation invitation) {
        // Aquí podrías notificar a ambos jugadores que comienza la partida
        GameResponse question = new GameResponse("¿Cuál es la capital de Francia?", 
        Arrays.asList("París", "Londres", "Berlín", "Madrid"), "París");

        messagingTemplate.convertAndSend("/game/start/" + invitation.getSender(), question); // Enviar la primera pregunta
        messagingTemplate.convertAndSend("/game/start/" + invitation.getRecipient(), question); // Enviar la misma pregunta al receptor
        System.out.println("QUESTION GAME" + question);
    }

    @MessageMapping("/response")
    public void handleResponse(GameResponse response) {
        // Lógica para manejar la respuesta del jugador
        if (response.getCorrectAnswer().equals(response.getCorrectAnswer())) {
            messagingTemplate.convertAndSend("/game/end", " GOKU ha ganado la partida.");
        } else {
            messagingTemplate.convertAndSend("/game/continue",  " KRILI ha respondido incorrectamente.");
        }
    }

}
