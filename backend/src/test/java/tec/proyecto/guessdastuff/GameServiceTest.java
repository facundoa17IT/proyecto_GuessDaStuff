import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.ArrayList;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import tec.proyecto.guessdastuff.dtos.DtoListTitlesResponse;
import tec.proyecto.guessdastuff.dtos.DtoMultipleChoice;
import tec.proyecto.guessdastuff.entities.Category;
import tec.proyecto.guessdastuff.entities.GameMode;
import tec.proyecto.guessdastuff.entities.MultipleChoice;
import tec.proyecto.guessdastuff.enums.ECategoryStatus;
import tec.proyecto.guessdastuff.enums.EGameMode;
import tec.proyecto.guessdastuff.exceptions.GameModeException;
import tec.proyecto.guessdastuff.repositories.CategoryRepository;
import tec.proyecto.guessdastuff.repositories.GameModeRepository;
import tec.proyecto.guessdastuff.repositories.GameRepository;
import tec.proyecto.guessdastuff.services.GameService;

public class GameServiceTest {

    @InjectMocks
    private GameService gameService;

    @Mock
    private GameRepository gameRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private GameModeRepository gameModeRepository;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }
    
   @Test
    public void testCreateMCIndividual_Success() throws GameModeException {
        // Arrange
        DtoMultipleChoice dtoMultipleChoice = new DtoMultipleChoice();
        dtoMultipleChoice.setId_Category(1L);
        dtoMultipleChoice.setRandomCorrectWord("Answer");
        dtoMultipleChoice.setRandomWord1("Option1");
        dtoMultipleChoice.setRandomWord2("Option2");
        dtoMultipleChoice.setRandomWord3("Option3");
        dtoMultipleChoice.setQuestion("What is the answer?");
        
        Category category = new Category();
        category.setId(1L);
        category.setName("Category 1");
        category.setStatus(ECategoryStatus.INITIALIZED);
        
        GameMode gameMode = new GameMode();
        gameMode.setName(EGameMode.MC.toString());
        
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(gameModeRepository.findByName(EGameMode.MC.toString())).thenReturn(Optional.of(gameMode));
        
        // Act
        ResponseEntity<?> response = gameService.createMCIndividual(dtoMultipleChoice);
        
        // Assert
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("se creo correctamente"));
        verify(gameRepository, times(1)).save(any(MultipleChoice.class));
    }

    @Test
    public void testCreateMCIndividual_CategoryNotFound() {
        // Arrange
        DtoMultipleChoice dtoMultipleChoice = new DtoMultipleChoice();
        dtoMultipleChoice.setId_Category(1L);
        
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());
        
        // Act & Assert
        assertThrows(GameModeException.class, () -> gameService.createMCIndividual(dtoMultipleChoice));
    }
    @Test
    public void testListTitlesOfCategory_Success() throws GameModeException {
        // Arrange
        Long idCategory = 1L;
        List<Object[]> mockResult = new ArrayList<>();
        mockResult.add(new Object[]{"MC", "Title1", 1L});
        
        when(gameRepository.listTitlesOfCategory(idCategory)).thenReturn(mockResult);
        
        // Act
        DtoListTitlesResponse response = gameService.listTitlesOfCategory(idCategory);
        
        // Assert
        assertNotNull(response);
        assertFalse(response.getTitles().isEmpty());
        assertTrue(response.getTitles().containsKey("MC"));
    }

    @Test
    public void testListTitlesOfCategory_NoTitlesFound() {
        // Arrange
        Long idCategory = 1L;
        
        when(gameRepository.listTitlesOfCategory(idCategory)).thenReturn(new ArrayList<>());
        
        // Act & Assert
        assertThrows(GameModeException.class, () -> gameService.listTitlesOfCategory(idCategory));
    }

}