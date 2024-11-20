package tec.proyecto.guessdastuff;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.boot.test.context.SpringBootTest;

import tec.proyecto.guessdastuff.dtos.DtoRankingResponse;
import tec.proyecto.guessdastuff.repositories.DataGameMultiRepository;
import tec.proyecto.guessdastuff.repositories.DataGameSingleRepository;
import tec.proyecto.guessdastuff.services.RankingService;

import java.util.List;
import java.util.Map;
import java.util.Arrays;


@SpringBootTest
public class RankingServiceTest {

    @Mock
    private DataGameSingleRepository dataGameSingleRepository;

    @Mock
    private DataGameMultiRepository dataGameMultiRepository;

    @InjectMocks
    private RankingService rankingService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRankingPartidasWin() {

        Object[] user1 = new Object[] { "user1", 5 };
        Object[] user2 = new Object[] { "user2", 10 };
        when(dataGameMultiRepository.getRankingPartidasGanadas()).thenReturn(Arrays.asList(user1, user2));

        List<DtoRankingResponse> response = rankingService.rankingPartidasWin();


        assertNotNull(response);
        assertEquals(2, response.size());
        assertEquals("user1", response.get(0).getUsername());
        assertEquals(5L, response.get(0).getCriterio()); 
        assertEquals("user2", response.get(1).getUsername());
        assertEquals(10L, response.get(1).getCriterio()); 
    }

    @Test
    void testRankingPuntaje() {
        Object[] user1Multi = new Object[] { "user1", 100 };
        Object[] user2Multi = new Object[] { "user2", 200 };
        when(dataGameMultiRepository.getRankingPuntaje()).thenReturn(Arrays.asList(user1Multi, user2Multi));

        Object[] user1Single = new Object[] { "user1", 150 };
        Object[] user2Single = new Object[] { "user2", 250 };
        when(dataGameSingleRepository.getRankingPuntajeSingle()).thenReturn(Arrays.asList(user1Single, user2Single));

        Map<String, List<DtoRankingResponse>> response = rankingService.rankingPuntaje();

        assertNotNull(response);
        assertTrue(response.containsKey("INDIVIDUAL"));
        assertTrue(response.containsKey("MULTIPLAYER"));

        List<DtoRankingResponse> individual = response.get("INDIVIDUAL");
        assertEquals(2, individual.size());
        assertEquals("user1", individual.get(0).getUsername());
        assertEquals(150L, individual.get(0).getCriterio()); 
        assertEquals("user2", individual.get(1).getUsername());
        assertEquals(250L, individual.get(1).getCriterio()); 

        List<DtoRankingResponse> multiplayer = response.get("MULTIPLAYER");
        assertEquals(2, multiplayer.size());
        assertEquals("user1", multiplayer.get(0).getUsername());
        assertEquals(100L, multiplayer.get(0).getCriterio()); 
        assertEquals("user2", multiplayer.get(1).getUsername());
        assertEquals(200L, multiplayer.get(1).getCriterio()); 
    }

    @Test
    void testRankingTiempo() {
        Object[] user1Multi = new Object[] { "user1", 300L };
        Object[] user2Multi = new Object[] { "user2", 400L };
        when(dataGameMultiRepository.getRankingMenorTiempoMulti()).thenReturn(Arrays.asList(user1Multi, user2Multi));

        Object[] user1Single = new Object[] { "user1", 500L };
        Object[] user2Single = new Object[] { "user2", 600L };
        when(dataGameSingleRepository.getRankingMenorTiempoSingle()).thenReturn(Arrays.asList(user1Single, user2Single));

        Map<String, List<DtoRankingResponse>> response = rankingService.rankingTiempo();

        assertNotNull(response);
        assertTrue(response.containsKey("INDIVIDUAL"));
        assertTrue(response.containsKey("MULTIPLAYER"));

        List<DtoRankingResponse> individual = response.get("INDIVIDUAL");
        assertEquals(2, individual.size());
        assertEquals("user1", individual.get(0).getUsername());
        assertEquals(500L, individual.get(0).getCriterio()); 
        assertEquals("user2", individual.get(1).getUsername());
        assertEquals(600L, individual.get(1).getCriterio()); 

        List<DtoRankingResponse> multiplayer = response.get("MULTIPLAYER");
        assertEquals(2, multiplayer.size());
        assertEquals("user1", multiplayer.get(0).getUsername());
        assertEquals(300L, multiplayer.get(0).getCriterio()); 
        assertEquals("user2", multiplayer.get(1).getUsername());
        assertEquals(400L, multiplayer.get(1).getCriterio()); 
    }
}
