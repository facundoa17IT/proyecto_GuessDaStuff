package tec.proyecto.guessdastuff;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import tec.proyecto.guessdastuff.entitiesSocket.DtoUserOnline;
import tec.proyecto.guessdastuff.controllers.LobbyController;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import static org.mockito.Mockito.*;

@WebMvcTest(LobbyController.class)
public class LobbyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private SimpMessagingTemplate simpMessagingTemplate;

    @InjectMocks
    private LobbyController lobbyController;

    private Set<DtoUserOnline> users;

    @BeforeEach
    public void setUp() {
        // Mock the users set
        users = ConcurrentHashMap.newKeySet();
    }

    @Test
    public void testJoinLobby() throws Exception {
        // Arrange
        DtoUserOnline user = new DtoUserOnline("user1", "User 1");
        users.add(user); // Add user to the mock users set

        // Act
        mockMvc.perform(webSocket("/app/join")
                .contentType("application/json")
                .content("{\"username\":\"user1\",\"name\":\"User 1\"}"))
                .andExpect(MockMvcResultMatchers.status().isOk());

        // Verify
        verify(simpMessagingTemplate, times(1)).convertAndSend("/topic/lobby", users);
    }

    @Test
    public void testLeaveLobby() throws Exception {
        // Arrange
        DtoUserOnline user = new DtoUserOnline("user1", "User 1");
        users.add(user); // Add user to the mock users set

        // Act
        mockMvc.perform(webSocket("/app/leave")
                .contentType("application/json")
                .content("{\"username\":\"user1\",\"name\":\"User 1\"}"))
                .andExpect(MockMvcResultMatchers.status().isOk());

        // Verify
        verify(simpMessagingTemplate, times(1)).convertAndSend("/topic/lobby", users);
    }
}