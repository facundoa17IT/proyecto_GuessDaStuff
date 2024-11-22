package tec.proyecto.guessdastuff;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.anyList;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import tec.proyecto.guessdastuff.dtos.DtoLoadGameRequest;
import tec.proyecto.guessdastuff.dtos.DtoLoadGameResponse;
import tec.proyecto.guessdastuff.dtos.DtoPlayGameRequest;
import tec.proyecto.guessdastuff.entities.Game;
import tec.proyecto.guessdastuff.entities.GameMode;
import tec.proyecto.guessdastuff.repositories.DataGameSingleRepository;
import tec.proyecto.guessdastuff.repositories.PlayRepository;
import tec.proyecto.guessdastuff.services.PlayService;

@SpringBootTest
class PlayServiceTest {

    @InjectMocks
    private PlayService playService;

    @Mock
    private PlayRepository playRepository;

    @Mock
    private DataGameSingleRepository dataGameSingleRepository;

    @InjectMocks
    private PlayServiceTest playServiceTest;

    @Test
    void initPlayGame_Success() {
        // Arrange
        String idGameSingle = "test-id";
        MockitoAnnotations.openMocks(this);

        // Act
        boolean result = playService.initPlayGame(idGameSingle);

        // Assert
        verify(dataGameSingleRepository, times(1)).initPlayGame(idGameSingle);
        assertTrue(result, "El método debería devolver true");
    }

    @Test
    void finishPlayGame_Success() {
        // Arrange
        String idGameSingle = "test-id";
        MockitoAnnotations.openMocks(this);

        // Act
        boolean result = playService.finishPlayGame(idGameSingle);

        // Assert
        verify(dataGameSingleRepository, times(1)).finishPlayGame(idGameSingle);
        assertTrue(result, "El método debería devolver true");
    }

    @Test
    void playGame_TimePlayingZero() {
    // Arrange
    DtoPlayGameRequest dtoPlayGameRequest = new DtoPlayGameRequest(
        "game-single-1", 
        "user-1", 
        "Correct Word", 
        1, 
        0.0f // Tiempo de juego en 0
    );

    Game mockGame = mock(Game.class);

    GameMode mockGameMode = mock(GameMode.class);
    when(mockGameMode.getName()).thenReturn("GP"); // Configuramos el nombre del modo de juego

    when(mockGame.getIdGameMode()).thenReturn(mockGameMode); // Configuramos el GameMode en el mock Game
    when(playRepository.getResultPlayGame(1)).thenReturn(mockGame);

    // Act
    boolean result = playService.playGame(dtoPlayGameRequest);

    // Assert
    verify(dataGameSingleRepository).updateDataGame("game-single-1", 0, 0); // Puntos y tiempo de juego son 0
    assertTrue(result);
    }
    

    @Test
    void testLoadGame_ShouldReturnValidResponse() {
        DtoLoadGameRequest dtoRequest = mock(DtoLoadGameRequest.class);
        
        when(playRepository.loadGameByCategories(anyList())).thenReturn(new ArrayList<>());

        DtoLoadGameResponse response = playService.loadGame(dtoRequest);

        assertNotNull(response);
        assertTrue(response.getCategories().isEmpty()); 
    }

}
