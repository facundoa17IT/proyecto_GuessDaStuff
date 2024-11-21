package tec.proyecto.guessdastuff;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import tec.proyecto.guessdastuff.repositories.LoadDataRepository;
import tec.proyecto.guessdastuff.services.LoadDataService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import static org.mockito.Mockito.*;

@SpringBootTest
class LoadDataServiceTest {

    @Mock
    private LoadDataRepository loadDataRepository;

    @InjectMocks
    private LoadDataService loadDataService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLoadData() {
        doNothing().when(loadDataRepository).insertUsers();
        doNothing().when(loadDataRepository).insertGameModes();
        doNothing().when(loadDataRepository).insertCategories();
        doNothing().when(loadDataRepository).insertMultipleMC();
        doNothing().when(loadDataRepository).insertMultiplesOW();
        doNothing().when(loadDataRepository).insertMultipleGP();

        String result = loadDataService.loadData();

        assertEquals("Data creada con exito", result);

        verify(loadDataRepository, times(1)).insertUsers();
        verify(loadDataRepository, times(1)).insertGameModes();
        verify(loadDataRepository, times(1)).insertCategories();
        verify(loadDataRepository, times(1)).insertMultipleMC();
        verify(loadDataRepository, times(1)).insertMultiplesOW();
        verify(loadDataRepository, times(1)).insertMultipleGP();

        verifyNoMoreInteractions(loadDataRepository);
    }
}