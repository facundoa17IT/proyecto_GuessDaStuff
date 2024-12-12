package tec.proyecto.guessdastuff;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import tec.proyecto.guessdastuff.dtos.*;
import tec.proyecto.guessdastuff.entities.*;
import tec.proyecto.guessdastuff.repositories.*;
import tec.proyecto.guessdastuff.services.MultiplayerService;

import java.util.Arrays;
import java.util.Optional;
import java.util.Collections;
import java.util.NoSuchElementException;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class MultiplayerServiceTest {

    @Mock
    private DataGameMultiRepository dataGameMultiRepository;
    
    @Mock
    private InfoGameMultiRepository infoGameMultiRepository;
    
    @Mock
    private PlayRepository playRepository;

    @InjectMocks
    private MultiplayerService multiplayerService;

    private DtoSendAnswer sendAnswerRequest;
    private DtoInitGameMultiRequest initGameRequest;

    @Mock
    private User userHost; 
    @Mock
    private User userGuest; 

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        when(userHost.getId()).thenReturn(1L); 
        when(userHost.getUsername()).thenReturn("hostUser");

        when(userGuest.getId()).thenReturn(2L); 
        when(userGuest.getUsername()).thenReturn("guestUser");


        DtoCreateMultiGameRequest.PlayerOnline playerHost = new DtoCreateMultiGameRequest.PlayerOnline(
            userHost.getUsername(), 
            String.valueOf(userHost.getId())  
        );

        DtoCreateMultiGameRequest.PlayerOnline playerGuest = new DtoCreateMultiGameRequest.PlayerOnline(
            userGuest.getUsername(), 
            String.valueOf(userGuest.getId())  
        );


        new DtoCreateMultiGameRequest(playerHost, playerGuest);

        sendAnswerRequest = new DtoSendAnswer();
        sendAnswerRequest.setIdGame("game1");
        sendAnswerRequest.setIdGameMulti("gameMulti1");
        sendAnswerRequest.setIdUserWin("1");
        sendAnswerRequest.setTime_playing(20f);

        initGameRequest = new DtoInitGameMultiRequest();
    }
/* 
    @Test
    public void testCreateGame() {
        when(dataGameMultiRepository.save(any(DataGameMulti.class)))
            .thenReturn(new DataGameMulti());

        String gameId = multiplayerService.createGame(createMultiGameRequest);

        verify(dataGameMultiRepository, times(1)).save(any(DataGameMulti.class));
        assertNotNull(gameId);
    }
  
    @Test
    public void testSendAnswer() {
        doNothing().when(infoGameMultiRepository).updateDataGame(any(), anyString(), anyInt(), anyFloat());

        DtoSendAnswerResponse response = multiplayerService.sendAnswer(sendAnswerRequest, "socket1");

        assertEquals("game1", response.getIdGame());
        assertEquals(2, response.getPoints()); 
        assertTrue(response.getIs_win());

        verify(infoGameMultiRepository, times(1)).updateDataGame(any(), anyString(), anyInt(), anyFloat());
    }
    */
    @Test
    public void testStartGame() {

        DtoInitGameMultiRequest.ParCatMod mode1 = new DtoInitGameMultiRequest.ParCatMod(1, "Mode1");
        DtoInitGameMultiRequest.ParCatMod mode2 = new DtoInitGameMultiRequest.ParCatMod(2, "Mode2");
    
        initGameRequest.setParCatMod(Arrays.asList(mode1, mode2));
    

        DataGameMulti mockDataGameMulti = new DataGameMulti();
        mockDataGameMulti.setIdUser1("1");  
        mockDataGameMulti.setIdUser2("2");  
        
        when(playRepository.findMC(anyInt())).thenReturn(new MultipleChoice());
        when(playRepository.findOW(anyInt())).thenReturn(new OrderWord());
        when(playRepository.findGP(anyInt())).thenReturn(new GuessPhrase());
        when(dataGameMultiRepository.findById(anyString()))
            .thenReturn(Optional.of(mockDataGameMulti));  
    
        DtoInitGameMultiResponse response = multiplayerService.startGame("game1", initGameRequest);
    
        assertNotNull(response);
        assertNotNull(response.getGameModes());
        assertEquals("game1", response.getIdGameMulti());
        

        assertEquals("1", response.getIdUserHost()); 
    
        assertEquals("2", response.getIdUserFriend());  
    }
  /*
    @Test
    public void testFinishGameMulti() {
        doNothing().when(infoGameMultiRepository).finishGameMulti(any(InfoGameMultiId.class));

        multiplayerService.finishGameMulti("socket1", "game1");

        verify(infoGameMultiRepository, times(1)).finishGameMulti(any(InfoGameMultiId.class));
    }

    @Test
    public void testFinishGame() {
        doNothing().when(dataGameMultiRepository).finishPlayGame(anyString());

        multiplayerService.finishGame("socket1");

        verify(dataGameMultiRepository, times(1)).finishPlayGame(anyString());
    }
    */
    @Test
    public void testStartGameWhenGameNotFound() {
        initGameRequest.setParCatMod(Collections.emptyList());

        when(dataGameMultiRepository.findById(anyString()))
            .thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> {
            multiplayerService.startGame("invalid_game_id", initGameRequest);
        });
    }


    @Test
    public void testStartGameWithNoModes() {
        initGameRequest.setParCatMod(Arrays.asList());
        when(dataGameMultiRepository.findById(anyString()))
            .thenReturn(Optional.of(new DataGameMulti()));

        DtoInitGameMultiResponse response = multiplayerService.startGame("game1", initGameRequest);
        assertTrue(response.getGameModes().isEmpty());
    }
/*
    @Test
    public void testCreateGameWithNullUser() {
        createMultiGameRequest.setUserHost(null);
        assertThrows(NullPointerException.class, () -> {
            multiplayerService.createGame(createMultiGameRequest);
        });
    }
*/
    @Test
    public void testStartGameWithInvalidGameId() {
        initGameRequest.setParCatMod(Collections.emptyList());
        when(dataGameMultiRepository.findById(anyString())).thenReturn(Optional.empty());
        try {
            DtoInitGameMultiResponse response = multiplayerService.startGame("invalid_game_id", initGameRequest);
            assertNull(response);
        } catch (NoSuchElementException e) {
            assertTrue(e instanceof NoSuchElementException);
        }
    }
    
}
