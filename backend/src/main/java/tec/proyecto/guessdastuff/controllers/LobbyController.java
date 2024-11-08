package tec.proyecto.guessdastuff.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Controller
@CrossOrigin(origins = "*")
public class LobbyController {

    private final SimpMessagingTemplate template;
    private final Set<String> users = ConcurrentHashMap.newKeySet(); // Lista de usuarios conectados

    public LobbyController(SimpMessagingTemplate template) {
        this.template = template;
    }

    @MessageMapping("/join")
    @SendTo("/topic/lobby")
    public Set<String> joinLobby(String username) {
        users.add(username); // Agregar usuario a la lista
        return users; // Enviar lista de usuarios al lobby
    }

    @MessageMapping("/leave")
    @SendTo("/topic/lobby")
    public Set<String> leaveLobby(String username) {
        users.remove(username); // Remover usuario de la lista
        return users; // Enviar lista de usuarios actualizada
    }
}
