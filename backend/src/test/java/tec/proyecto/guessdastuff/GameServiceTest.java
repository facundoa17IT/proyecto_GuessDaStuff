package tec.proyecto.guessdastuff;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Optional;
import java.util.List;
import java.util.ArrayList;
import java.lang.reflect.Field;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import tec.proyecto.guessdastuff.converters.DateConverter;
import tec.proyecto.guessdastuff.converters.GameConverter;
import tec.proyecto.guessdastuff.dtos.*;
import tec.proyecto.guessdastuff.entities.*;
import tec.proyecto.guessdastuff.enums.*;
import tec.proyecto.guessdastuff.exceptions.GameModeException;
import tec.proyecto.guessdastuff.repositories.*;
import tec.proyecto.guessdastuff.services.GameService;

@ExtendWith(MockitoExtension.class)
public class GameServiceTest {

    @InjectMocks
    private GameService gameService;

    @Mock
    private GameRepository gameRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private GameModeRepository gameModeRepository;

    @Mock
    private DateConverter dateConverter;

    @Mock
    private GameConverter gameConverter;

    private Category testCategory;
    private GameMode testGameMode;

    @BeforeEach
    public void setUp() throws NoSuchFieldException, IllegalAccessException {
        // Use reflection to set values in Category
        testCategory = new Category(); // Create an empty instance

        // Set values via reflection (matching constructor parameters)
        Field idField = Category.class.getDeclaredField("id");
        idField.setAccessible(true);
        idField.set(testCategory, 1L);

        Field nameField = Category.class.getDeclaredField("name");
        nameField.setAccessible(true);
        nameField.set(testCategory, "Test Category");

        Field statusField = Category.class.getDeclaredField("status");
        statusField.setAccessible(true);
        statusField.set(testCategory, ECategoryStatus.EMPTY);
    }

    @Test
    public void testListTitlesOfCategory_Success() throws GameModeException {
        List<Object[]> mockResult = new ArrayList<>();
        mockResult.add(new Object[]{"MC", "Sample Title 1", 1L});
        mockResult.add(new Object[]{"OW", "Sample Title 2", 2L});

        when(gameRepository.listTitlesOfCategory(1L)).thenReturn(mockResult);

        DtoListTitlesResponse response = gameService.listTitlesOfCategory(1L);

        assertNotNull(response);
        assertTrue(response.getTitlesOfCategory().containsKey("MC"));
        assertEquals(1, response.getTitlesOfCategory().get("MC").size());
        assertEquals("Sample Title 1", response.getTitlesOfCategory().get("MC").get(0).getTitle());
    }

    @Test
    public void testCreateMCIndividual_Success() throws GameModeException {
        DtoMultipleChoice dto = new DtoMultipleChoice("MC", 1L, "4", "1", "2", "3", "Hint1", "Hint2", "Hint3", "What is 2+2?");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(gameModeRepository.findByName("MC")).thenReturn(Optional.of(testGameMode));

        ResponseEntity<?> response = gameService.createMCIndividual(dto);

        assertEquals("El titulo: What is 2+2?, se creo correctamente para la categoria Test Category y modo de juego MC", response.getBody());
        verify(gameRepository, times(1)).save(any(MultipleChoice.class));
    }

    @Test
    public void testCreateOWIndividual_Success() throws GameModeException {
        DtoOrderWord dto = new DtoOrderWord("OW", 1L, "WORD", "Hint1", "Hint2", "Hint3");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(gameModeRepository.findByName("OW")).thenReturn(Optional.of(testGameMode));

        ResponseEntity<?> response = gameService.createOWIndividual(dto);

        assertEquals("La palabra WORD se creó correctamente para la categoría Test Category y modo de juego OW", response.getBody());
        verify(gameRepository, times(1)).save(any(OrderWord.class));
    }


    @Test
    public void testCreateGPIndividual_Success() throws GameModeException {
        DtoGuessPhrase dto = new DtoGuessPhrase("GP", 1L, "Guess this phrase", "CorrectWord", "Hint1", "Hint2", "Hint3");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(gameModeRepository.findByName("GP")).thenReturn(Optional.of(testGameMode));

        ResponseEntity<?> response = gameService.createGPIndividual(dto);

        assertEquals("La frase Guess this phrase se creó correctamente para la categoría Test Category y modo de juego GP", response.getBody());
        verify(gameRepository, times(1)).save(any(GuessPhrase.class));
    }

    @Test
    public void testGetDataOfGameMode_Success_GuessPhrase() throws GameModeException {
        GuessPhrase guessPhrase = new GuessPhrase(1L, testGameMode, testCategory, "Phrase", "CorrectWord", "Hint1", "Hint2", "Hint3");
        DtoGuessPhrase dtoGuessPhrase = new DtoGuessPhrase("GP", 1L, "Phrase", "CorrectWord", "Hint1", "Hint2", "Hint3");

        when(gameRepository.findById(1L)).thenReturn(Optional.of(guessPhrase));
        when(gameConverter.toDtoGuessPhrase(guessPhrase)).thenReturn(dtoGuessPhrase);

        ResponseEntity<?> response = gameService.getDataOfGameMode(1L);

        assertNotNull(response);
        assertEquals(dtoGuessPhrase, response.getBody());
    }

    @Test
    public void testEditMultipleChoice_Success() {
        DtoMultipleChoice dto = new DtoMultipleChoice("MC", 1L, "4", "1", "2", "3", "Hint1", "Hint2", "Hint3", "What is 2+2?");
        MultipleChoice multipleChoice = new MultipleChoice(1L, testGameMode, testCategory, "Old Answer", "Old1", "Old2", "Old3", "Old Question", "Old Hint1", "Old Hint2", "Old Hint3");

        when(gameRepository.findById(1L)).thenReturn(Optional.of(multipleChoice));

        ResponseEntity<?> response = gameService.editMultipleCoice(1L, dto);

        assertEquals("El modo de juego MC con id 1 ha sido modificado correctamente!", response.getBody());
        verify(gameRepository, times(1)).save(multipleChoice);
    }

    @Test
    public void testEditOrderWord_Success() {
        DtoOrderWord dto = new DtoOrderWord("OW", 1L, "NewWord", "Hint1", "Hint2", "Hint3");
        OrderWord orderWord = new OrderWord(1L, testGameMode, testCategory, "OldWord", "Old Hint1", "Old Hint2", "Old Hint3");

        when(gameRepository.findById(1L)).thenReturn(Optional.of(orderWord));

        ResponseEntity<?> response = gameService.editOrderWord(1L, dto);

        assertEquals("El modo de juego OW con id 1 ha sido modificado correctamente!", response.getBody());
        verify(gameRepository, times(1)).save(orderWord);
    }
}
