// package tec.proyecto.guessdastuff;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import tec.proyecto.guessdastuff.repositories.LoadDataRepository;
// import tec.proyecto.guessdastuff.services.LoadDataService;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.mockito.Mockito.times;
// import static org.mockito.Mockito.verify;

// class LoadDataServiceTest {

//     @InjectMocks
//     private LoadDataService loadDataService;

//     @Mock
//     private LoadDataRepository loadDataRepository;

//     @BeforeEach
//     void setUp() {
//         MockitoAnnotations.openMocks(this);
//     }

//     @Test
//     void testLoadData_ShouldCallRepositoryMethodsAndReturnSuccessMessage() {
//         // Call the method
//         String result = loadDataService.loadData();

//         // Verify that each repository method is called once
//         verify(loadDataRepository, times(1)).insertUsers();
//         verify(loadDataRepository, times(1)).insertGameModes();
//         verify(loadDataRepository, times(1)).insertCategories();
//         verify(loadDataRepository, times(1)).insertMultipleMC();
//         verify(loadDataRepository, times(1)).insertMultiplesOW();
//         verify(loadDataRepository, times(1)).insertMultipleGP();

//         // Assert the return message
//         assertEquals("Data creada con exito", result);
//     }
// }
