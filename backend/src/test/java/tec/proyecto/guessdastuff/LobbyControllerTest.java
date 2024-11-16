/* package tec.proyecto.guessdastuff;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import tec.proyecto.guessdastuff.entitiesSocket.DtoUserOnline;
import tec.proyecto.guessdastuff.controllers.LobbyController;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@SpringBootTest
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
        DtoUserOnline user = new DtoUserOnline(null, "user1", "User 1");
        users.add(user); // Add user to the mock users set

        // Act
        mockMvc.perform(post("/app/join")  // Use post for standard HTTP endpoints
                .contentType("application/json")
                .content("{\"username\":\"user1\",\"name\":\"User 1\"}"))
                .andExpect(MockMvcResultMatchers.status().isOk());

        // Verify
        verify(simpMessagingTemplate, times(1)).convertAndSend("/topic/lobby", users);
    }

    @Test
    public void testLeaveLobby() throws Exception {
        // Arrange
        DtoUserOnline user = new DtoUserOnline(null, "user1", "User 1");
        users.add(user); // Add user to the mock users set

        // Act
        mockMvc.perform(post("/app/leave")  // Use post for standard HTTP endpoints
                .contentType("application/json")
                .content("{\"username\":\"user1\",\"name\":\"User 1\"}"))
                .andExpect(MockMvcResultMatchers.status().isOk());

        // Verify
        verify(simpMessagingTemplate, times(1)).convertAndSend("/topic/lobby", users);
    }
}
*/