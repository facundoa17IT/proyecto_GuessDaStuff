/* package tec.proyecto.guessdastuff;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.multipart.MultipartFile;

import tec.proyecto.guessdastuff.dtos.*;
import tec.proyecto.guessdastuff.services.GameService;
import tec.proyecto.guessdastuff.controllers.GameController;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(GameController.class)
public class GameControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private GameService gameService;

    @Autowired
    private ObjectMapper objectMapper;

    @InjectMocks
    private GameController gameController;

    private DtoMultipleChoice dtoMultipleChoice;
    private DtoOrderWord dtoOrderWord;
    private DtoGuessPhrase dtoGuessPhrase;
    private DtoInitGameResponse dtoGameModeResponse;

    @BeforeEach
    public void setUp() {
        dtoMultipleChoice = new DtoMultipleChoice();  // Initialize as needed
        dtoOrderWord = new DtoOrderWord();  // Initialize as needed
        dtoGuessPhrase = new DtoGuessPhrase();  // Initialize as needed
        dtoGameModeResponse = new DtoInitGameResponse();  // Initialize as needed
    }

    @Test
    void getDataOfGameMode_Success() throws Exception {
        Long idGame = 1L;
        when(gameService.getDataOfGameMode(idGame)).thenReturn(dtoGameModeResponse);

        mockMvc.perform(get("/api/game-modes/v1/{idGame}", idGame))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").exists());
    }

    @Test
    void listTitlesOfCategory_Success() throws Exception {
        Long idCategory = 1L;
        when(gameService.listTitlesOfCategory(idCategory)).thenReturn(List.of(new DtoTitleWithId()));  // Adjust DTO as needed

        mockMvc.perform(get("/api/game-modes/v1/titles/{idCategory}", idCategory))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void listGames_Success() throws Exception {
        when(gameService.listPlayGames()).thenReturn(dtoGameModeResponse);  // Adjust DTO as needed

        mockMvc.perform(get("/api/game-modes/v1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").exists());
    }

    @Test
    void createMCIndividual_Success() throws Exception {
        when(gameService.createMCIndividual(dtoMultipleChoice)).thenReturn(dtoGameModeResponse);  // Adjust return value

        mockMvc.perform(post("/api/game-modes/v1/individual/MC")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtoMultipleChoice)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").exists());
    }

    @Test
    void createMCMasive_Success() throws Exception {
        Long idCategory = 1L;
        MultipartFile file = mock(MultipartFile.class);  // Mock the file
        when(gameService.createMCMasive(idCategory, file)).thenReturn(dtoGameModeResponse);  // Adjust return value

        mockMvc.perform(post("/api/game-modes/v1/masive/MC")
                .param("idCategory", idCategory.toString())
                .file("file", "sample data".getBytes()))  // Mock file data
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists());
    }

    @Test
    void createOWIndividual_Success() throws Exception {
        when(gameService.createOWIndividual(dtoOrderWord)).thenReturn(dtoGameModeResponse);

        mockMvc.perform(post("/api/game-modes/v1/individual/OW")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtoOrderWord)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").exists());
    }

    @Test
    void createOWMasive_Success() throws Exception {
        Long idCategory = 1L;
        MultipartFile file = mock(MultipartFile.class);
        when(gameService.createOWMasive(idCategory, file)).thenReturn(dtoGameModeResponse);

        mockMvc.perform(post("/api/game-modes/v1/masive/OW")
                .param("idCategory", idCategory.toString())
                .file("file", "sample data".getBytes()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists());
    }

    @Test
    void createGPIndividual_Success() throws Exception {
        when(gameService.createGPIndividual(dtoGuessPhrase)).thenReturn(dtoGameModeResponse);

        mockMvc.perform(post("/api/game-modes/v1/individual/GP")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtoGuessPhrase)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").exists());
    }

    @Test
    void createGPMasive_Success() throws Exception {
        Long idCategory = 1L;
        MultipartFile file = mock(MultipartFile.class);
        when(gameService.createGPMasive(idCategory, file)).thenReturn(dtoGameModeResponse);

        mockMvc.perform(post("/api/game-modes/v1/masive/GP")
                .param("idCategory", idCategory.toString())
                .file("file", "sample data".getBytes()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").exists());
    }

    @Test
    void editMultipleChoice_Success() throws Exception {
        Long idGame = 1L;
        when(gameService.editMultipleCoice(idGame, dtoMultipleChoice)).thenReturn("Multiple choice game edited successfully");

        mockMvc.perform(put("/api/game-modes/v1/MC/{idGame}", idGame)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtoMultipleChoice)))
                .andExpect(status().isOk())
                .andExpect(content().string("Multiple choice game edited successfully"));
    }

    @Test
    void editOrderWord_Success() throws Exception {
        Long idGame = 1L;
        when(gameService.editOrderWord(idGame, dtoOrderWord)).thenReturn(ResponseEntity.ok("Order word game edited successfully"));

        mockMvc.perform(put("/api/game-modes/v1/OW/{idGame}", idGame)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtoOrderWord)))
                .andExpect(status().isOk())
                .andExpect(content().string("Order word game edited successfully"));
    }

    @Test
    void editGuessPhrase_Success() throws Exception {
        Long idGame = 1L;
        when(gameService.editGuessPhrase(idGame, dtoGuessPhrase)).thenReturn("Guess phrase game edited successfully");

        mockMvc.perform(put("/api/game-modes/v1/GP/{idGame}", idGame)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtoGuessPhrase)))
                .andExpect(status().isOk())
                .andExpect(content().string("Guess phrase game edited successfully"));
    }
}
*/