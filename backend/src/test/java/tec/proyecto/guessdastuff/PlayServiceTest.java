package tec.proyecto.guessdastuff;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import tec.proyecto.guessdastuff.dtos.DtoInitGameRequest;
import tec.proyecto.guessdastuff.dtos.DtoInitGameResponse;
import tec.proyecto.guessdastuff.dtos.DtoLoadGameRequest;
import tec.proyecto.guessdastuff.dtos.DtoLoadGameResponse;
import tec.proyecto.guessdastuff.entities.DataGameSingle;
import tec.proyecto.guessdastuff.entities.GameMode;
import tec.proyecto.guessdastuff.entities.MultipleChoice;
import tec.proyecto.guessdastuff.enums.ECategoryStatus;
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

    /*@Test
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
    }*/
    

    @Test
    void testLoadGame_ShouldReturnValidResponse() {
        DtoLoadGameRequest dtoRequest = mock(DtoLoadGameRequest.class);
        
        when(playRepository.loadGameByCategories(anyList())).thenReturn(new ArrayList<>());

        DtoLoadGameResponse response = playService.loadGame(dtoRequest);

        assertNotNull(response);
        assertTrue(response.getCategories().isEmpty()); 
    }

   
   
    @Test
    void testInitGame() {
        // Mock del DTO de entrada
        DtoInitGameRequest request = new DtoInitGameRequest();
        request.setUserId("user123");
        request.setParCatMod(Arrays.asList(
                new DtoInitGameRequest.ParCatMod(1, "MC"),
                new DtoInitGameRequest.ParCatMod(2, "OW")
        ));

        // Mock de datos para MultipleChoice
        MultipleChoice multipleChoice = new MultipleChoice();
        multipleChoice.setId(1L);
        multipleChoice.setIdGameMode(new GameMode("MC","MCURL","Multiple Choice"));
        multipleChoice.setIdCategory(new tec.proyecto.guessdastuff.entities.Category(1L, "Available1", "Description1", "URL1", ECategoryStatus.INITIALIZED));
        multipleChoice.setHint1("Hint 1");
        multipleChoice.setHint2("Hint 2");
        multipleChoice.setHint3("Hint 3");
        multipleChoice.setRandomCorrectWord("Correct");
        multipleChoice.setRandomWord1("Option1");
        multipleChoice.setRandomWord2("Option2");
        multipleChoice.setRandomWord3("Option3");
        multipleChoice.setQuestion("Sample question?");

        when(playRepository.findMC(1)).thenReturn(multipleChoice);
        when(playRepository.findOW(2)).thenReturn(null); // Simula que OW no devuelve datos

        // Mock para guardar el objeto DataGameSingle
        DataGameSingle dataGameSingle = new DataGameSingle();
        dataGameSingle.setId(UUID.randomUUID().toString());
        dataGameSingle.setIdUser("user123");
        dataGameSingle.setPoints(0);
        dataGameSingle.setTimePlaying(0);
        dataGameSingle.setTmstmpInit(LocalDateTime.now());
        dataGameSingle.setFinish(false);

        when(dataGameSingleRepository.save(any(DataGameSingle.class)))
                .thenReturn(dataGameSingle);

        // Llamar al método y verificar resultados
        DtoInitGameResponse response = playService.initGame(request);

        assertNotNull(response);
        assertEquals("user123", dataGameSingle.getIdUser());
        assertEquals(1, response.getGameModes().size());
        assertEquals("juego_1", response.getGameModes().keySet().iterator().next());

        // Verificar que los métodos de los repositorios se llamaron
        verify(playRepository, times(1)).findMC(1);
        verify(playRepository, times(1)).findOW(2);
        verify(dataGameSingleRepository, times(1)).save(any(DataGameSingle.class));
    }

}
