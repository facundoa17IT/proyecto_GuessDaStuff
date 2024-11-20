package tec.proyecto.guessdastuff;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;



import tec.proyecto.guessdastuff.dtos.DtoLoadGameRequest;
import tec.proyecto.guessdastuff.dtos.DtoLoadGameResponse;
import tec.proyecto.guessdastuff.repositories.PlayRepository;
import tec.proyecto.guessdastuff.repositories.DataGameSingleRepository;
import tec.proyecto.guessdastuff.services.PlayService;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

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
    void testFinishPlayGame_ShouldCallRepositoryMethod() {
        String idGameSingle = "game123";
        
        doNothing().when(dataGameSingleRepository).finishPlayGame(idGameSingle);

        boolean result = playService.finishPlayGame(idGameSingle);

        assertTrue(result);
        verify(dataGameSingleRepository, times(1)).finishPlayGame(idGameSingle);
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
