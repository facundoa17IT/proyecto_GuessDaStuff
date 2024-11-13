package tec.proyecto.guessdastuff.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import tec.proyecto.guessdastuff.entitiesSocket.DtoUserOnline;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Controller
@CrossOrigin(origins = "*")
public class LobbyController {

    private final SimpMessagingTemplate template;
    private final Set<DtoUserOnline> users = ConcurrentHashMap.newKeySet(); // Lista de usuarios conectados

    public LobbyController(SimpMessagingTemplate template) {
        this.template = template;
    }

    @MessageMapping("/join")
    @SendTo("/topic/lobby")
    public Set<DtoUserOnline> joinLobby(DtoUserOnline dtoUserOnline) {
        users.add(dtoUserOnline); // Agregar usuario a la lista
        return users; // Enviar lista de usuarios al lobby
    }

    @MessageMapping("/leave")
    @SendTo("/topic/lobby")
    public Set<DtoUserOnline> leaveLobby(DtoUserOnline dtoUserOnline) {
        users.remove(dtoUserOnline); // Remover usuario de la lista
        return users; // Enviar lista de usuarios actualizada
    }
}
