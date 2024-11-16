/* package tec.proyecto.guessdastuff;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import tec.proyecto.guessdastuff.services.PlayService;
import tec.proyecto.guessdastuff.dtos.*;
import tec.proyecto.guessdastuff.controllers.PlayController;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

public class PlayControllerTest {

    private MockMvc mockMvc;

    @Mock
    private PlayService playService;

    @InjectMocks
    private PlayController playController;

    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(playController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    public void testLoadGame() throws Exception {
        // Arrange
        DtoLoadGameRequest request = new DtoLoadGameRequest();
        DtoLoadGameResponse response = new DtoLoadGameResponse();
        when(playService.loadGame(any(DtoLoadGameRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/game-single/v1/load-game")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(response)));

        // Verify
        verify(playService, times(1)).loadGame(any(DtoLoadGameRequest.class));
    }

    @Test
    public void testInitGame() throws Exception {
        // Arrange
        DtoInitGameRequest request = new DtoInitGameRequest();
        DtoInitGameResponse response = new DtoInitGameResponse();
        when(playService.initGame(any(DtoInitGameRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/game-single/v1/init-game")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(response)));

        // Verify
        verify(playService, times(1)).initGame(any(DtoInitGameRequest.class));
    }

    @Test
    public void testPlayGame() throws Exception {
        // Arrange
        DtoPlayGameRequest request = new DtoPlayGameRequest();
        when(playService.playGame(any(DtoPlayGameRequest.class))).thenReturn(true);

        // Act & Assert
        mockMvc.perform(post("/api/game-single/v1/play-game")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        // Verify
        verify(playService, times(1)).playGame(any(DtoPlayGameRequest.class));
    }

    @Test
    public void testInitPlayGame() throws Exception {
        // Arrange
        String gameId = "123";
        when(playService.initPlayGame(gameId)).thenReturn(true);

        // Act & Assert
        mockMvc.perform(post("/api/game-single/v1/init-play-game/{idGameSingle}", gameId))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        // Verify
        verify(playService, times(1)).initPlayGame(gameId);
    }

    @Test
    public void testFinishPlayGame() throws Exception {
        // Arrange
        String gameId = "123";
        when(playService.finishPlayGame(gameId)).thenReturn(true);

        // Act & Assert
        mockMvc.perform(post("/api/game-single/v1/finish-play-game/{idGameSingle}", gameId))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        // Verify
        verify(playService, times(1)).finishPlayGame(gameId);
    }
}
*/