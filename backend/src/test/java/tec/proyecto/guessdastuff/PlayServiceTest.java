// package tec.proyecto.guessdastuff;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import tec.proyecto.guessdastuff.dtos.DtoPlayGameRequest;
// import tec.proyecto.guessdastuff.dtos.DtoLoadGameRequest;
// import tec.proyecto.guessdastuff.dtos.DtoLoadGameResponse;
// import tec.proyecto.guessdastuff.dtos.DtoInitGameRequest;
// import tec.proyecto.guessdastuff.dtos.DtoInitGameResponse;
// import tec.proyecto.guessdastuff.entities.Game;
// import tec.proyecto.guessdastuff.entities.GuessPhrase;
// import tec.proyecto.guessdastuff.entities.MultipleChoice;
// import tec.proyecto.guessdastuff.entities.OrderWord;
// import tec.proyecto.guessdastuff.repositories.PlayRepository;
// import tec.proyecto.guessdastuff.repositories.DataGameSingleRepository;
// import tec.proyecto.guessdastuff.services.PlayService;

// import static org.mockito.ArgumentMatchers.*;
// import static org.mockito.Mockito.*;

// import java.util.ArrayList;

// import static org.junit.jupiter.api.Assertions.*;

// class PlayServiceTest {

//     @InjectMocks
//     private PlayService playService;

//     @Mock
//     private PlayRepository playRepository;

//     @Mock
//     private DataGameSingleRepository dataGameSingleRepository;

//     @BeforeEach
//     void setUp() {
//         MockitoAnnotations.openMocks(this);
//     }

//     @Test
//     public void testInitPlayGame() {
//         // Arrange
//         String gameId = "12345";
        
//         // Use doNothing for void methods
//         doNothing().when(playService).initPlayGame(gameId);

//         // Act
//         playService.initPlayGame(gameId);

//         // Assert
//         verify(playService, times(1)).initPlayGame(gameId);  // Verify that the method was called once
//     }
    
//     @Test
//     void testFinishPlayGame_ShouldCallRepositoryMethod() {
//         String idGameSingle = "game123";
        
//         // Use doNothing() for the void method
//         doNothing().when(dataGameSingleRepository).finishPlayGame(idGameSingle);

//         boolean result = playService.finishPlayGame(idGameSingle);

//         assertTrue(result);
//         verify(dataGameSingleRepository, times(1)).finishPlayGame(idGameSingle);
//     }

//     @Test
//     void testPlayGame_CorrectAnswer_ShouldReturnTrue() {
//         // Setup mock data
//         String idGameSingle = "game123";
//         String response = "correct_answer";
//         float timePlaying = 5.0f;
//         DtoPlayGameRequest dtoRequest = new DtoPlayGameRequest();
//         dtoRequest.setIdGameSingle(idGameSingle);
//         dtoRequest.setResponse(response);
//         dtoRequest.setTime_playing(timePlaying);

//         // Mock the Game object (GuessPhrase in this case)
//         Game gameMock = mock(GuessPhrase.class);
        
//         // Mock repository method for retrieving game results
//         when(playRepository.getResultPlayGame(dtoRequest.getIdGame())).thenReturn(gameMock);
        
//         // Mock further methods on gameMock
//         when(gameMock.getIdGameMode().getName()).thenReturn("GP");
//         when(((GuessPhrase) gameMock).getCorrectWord()).thenReturn(response);

//         // Use doReturn() for the void method
//         doReturn(true).when(dataGameSingleRepository).updateDataGame(anyString(), anyInt(), anyFloat());

//         // Call the service method
//         boolean result = playService.playGame(dtoRequest);

//         // Assert the result
//         assertTrue(result);
//         verify(dataGameSingleRepository, times(1)).updateDataGame(anyString(), anyInt(), anyFloat());
//     }


//     @Test
//     void testPlayGame_WrongAnswer_ShouldReturnFalse() {
//         // Setup mock data
//         String idGameSingle = "game123";
//         String response = "wrong_answer";
//         float timePlaying = 10.0f;
//         DtoPlayGameRequest dtoRequest = new DtoPlayGameRequest();
//         dtoRequest.setIdGameSingle(idGameSingle);
//         dtoRequest.setResponse(response);
//         dtoRequest.setTime_playing(timePlaying);

//         Game gameMock = mock(GuessPhrase.class);
//         when(playRepository.getResultPlayGame(dtoRequest.getIdGame())).thenReturn(gameMock);
//         when(gameMock.getIdGameMode().getName()).thenReturn("GP");
//         when(((GuessPhrase) gameMock).getCorrectWord()).thenReturn("correct_answer");

//         // Mock repository method that returns a value
//         doNothing().when(dataGameSingleRepository).updateDataGame(anyString(), anyInt(), anyFloat());  // Use doNothing() for void methods

//         boolean result = playService.playGame(dtoRequest);

//         assertFalse(result);
//         verify(dataGameSingleRepository, times(0)).updateDataGame(anyString(), anyInt(), anyFloat());
//     }

//     @Test
//     void testInitGame_ShouldReturnValidResponse() {
//         // Mock the request
//         DtoInitGameRequest dtoRequest = mock(DtoInitGameRequest.class);

//         // Mock responses from repository
//         when(playRepository.findMC(anyInt())).thenReturn(mock(MultipleChoice.class));  // Change to Integer
//         when(playRepository.findOW(anyInt())).thenReturn(mock(OrderWord.class));  // Change to Integer
//         when(playRepository.findGP(anyInt())).thenReturn(mock(GuessPhrase.class));  // Change to Integer

//         DtoInitGameResponse response = playService.initGame(dtoRequest);

//         assertNotNull(response);
//         assertEquals(3, response.getGameModes().size()); // Check that three game modes were added
//     }

//     @Test
//     void testLoadGame_ShouldReturnValidResponse() {
//         // Setup mock request and result
//         DtoLoadGameRequest dtoRequest = mock(DtoLoadGameRequest.class);
        
//         // Mock repository method that returns a value
//         when(playRepository.loadGameByCategories(anyList())).thenReturn(new ArrayList<>()); // Mocking empty result

//         // Call the service method
//         DtoLoadGameResponse response = playService.loadGame(dtoRequest);

//         assertNotNull(response);
//         assertTrue(response.getCategories().isEmpty()); // Use getCategories() instead of getCategoriesList()
//     }
// }
