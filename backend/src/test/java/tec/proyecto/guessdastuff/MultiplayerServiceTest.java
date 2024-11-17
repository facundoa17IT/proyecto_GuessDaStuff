/*package tec.proyecto.guessdastuff;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import tec.proyecto.guessdastuff.dtos.*;
import tec.proyecto.guessdastuff.entities.*;
import tec.proyecto.guessdastuff.repositories.*;
import tec.proyecto.guessdastuff.services.MultiplayerService;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Arrays;
import java.util.Optional;

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

    private DtoCreateMultiGameRequest createMultiGameRequest;
    private DtoSendAnswer sendAnswerRequest;
    private DtoInitGameMultiRequest initGameRequest;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        // Mockear las peticiones DTO
        createMultiGameRequest = new DtoCreateMultiGameRequest();
        createMultiGameRequest.setUserHost(new UserHost("1"));
        createMultiGameRequest.setUserGuest(new UserGuest("2"));

        sendAnswerRequest = new DtoSendAnswer();
        sendAnswerRequest.setIdGame("game1");
        sendAnswerRequest.setIdGameMulti("gameMulti1");
        sendAnswerRequest.setIdUserWin("1");
        sendAnswerRequest.setTime_playing(20f);

        initGameRequest = new DtoInitGameMultiRequest();
        // Llenar initGameRequest con datos de ejemplo
    }

    @Test
    public void testCreateGame() {
        // Preparar el objeto mock para el repositorio
        when(dataGameMultiRepository.save(any(DataGameMulti.class)))
            .thenReturn(new DataGameMulti());

        String gameId = multiplayerService.createGame(createMultiGameRequest);

        // Verificar que el repositorio se llamó y que el resultado no es null
        verify(dataGameMultiRepository, times(1)).save(any(DataGameMulti.class));
        assert gameId != null;
    }

    @Test
    public void testSendAnswer() {
        // Configurar el mock para el repositorio
        when(infoGameMultiRepository.updateDataGame(any(), anyString(), anyInt(), anyFloat()))
            .thenReturn(1);

        DtoSendAnswerResponse response = multiplayerService.sendAnswer(sendAnswerRequest, "socket1");

        // Verificar que la respuesta contiene los valores esperados
        assert response.getIdGame().equals("game1");
        assert response.getPoints() == 2; // Según la lógica de tiempo de respuesta
        assert response.getIs_win() == true;
        verify(infoGameMultiRepository, times(1)).updateDataGame(any(), anyString(), anyInt(), anyFloat());
    }

    @Test
    public void testStartGame() {
        // Mockear la respuesta de los repositorios
        when(playRepository.findMC(anyString())).thenReturn(new MultipleChoice());
        when(playRepository.findOW(anyString())).thenReturn(new OrderWord());
        when(playRepository.findGP(anyString())).thenReturn(new GuessPhrase());
        when(dataGameMultiRepository.findById(anyString()))
            .thenReturn(Optional.of(new DataGameMulti()));

        DtoInitGameMultiResponse response = multiplayerService.startGame("game1", initGameRequest);

        // Verificar que la respuesta no sea nula y que contiene la información esperada
        assert response != null;
        assert response.getGameModes() != null;
        assert response.getIdGameMulti().equals("game1");
        assert response.getIdUserHost().equals("1");
        assert response.getIdUserFriend().equals("2");
        verify(playRepository, times(1)).findMC(anyString());
        verify(playRepository, times(1)).findOW(anyString());
        verify(playRepository, times(1)).findGP(anyString());
    }
}
*/