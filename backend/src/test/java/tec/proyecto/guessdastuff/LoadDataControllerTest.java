package tec.proyecto.guessdastuff;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import tec.proyecto.guessdastuff.controllers.LoadDataController;
import tec.proyecto.guessdastuff.services.LoadDataService;

@ExtendWith(MockitoExtension.class)
class LoadDataControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private LoadDataService loadDataService;

    @InjectMocks
    private LoadDataController loadDataController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(loadDataController).build();
    }

    @Test
    void loadData_Success() throws Exception {
        // Arrange: Mock the service method to return some response
        when(loadDataService.loadData()).thenReturn("Data loaded successfully");

        // Act & Assert: Perform POST request and check for successful response
        mockMvc.perform(post("/api/v1/load-data"))
                .andExpect(status().isOk())
                .andExpect(content().string("Data loaded successfully"));

        // Verify that the service method was called once
        verify(loadDataService, times(1)).loadData();
    }

    @Test
    void loadData_Failure() throws Exception {
        // Arrange: Mock the service method to throw an exception
        when(loadDataService.loadData()).thenThrow(new RuntimeException("Failed to load data"));

        // Act & Assert: Perform POST request and check for error response
        mockMvc.perform(post("/api/v1/load-data"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(""));

        // Verify that the service method was called once
        verify(loadDataService, times(1)).loadData();
    }
}
