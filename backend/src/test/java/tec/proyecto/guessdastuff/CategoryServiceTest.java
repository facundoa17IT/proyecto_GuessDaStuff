// package tec.proyecto.guessdastuff;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.mockito.Mockito.*;

// import java.util.Arrays;
// import java.util.List;
// import java.util.Optional;

// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.MockitoAnnotations;
// import org.springframework.http.ResponseEntity;

// import tec.proyecto.guessdastuff.converters.CategoryConverter;
// import tec.proyecto.guessdastuff.dtos.DtoCategory;
// import tec.proyecto.guessdastuff.dtos.DtoCategoryRequest;
// import tec.proyecto.guessdastuff.entities.Category;
// import tec.proyecto.guessdastuff.enums.ECategoryStatus;
// import tec.proyecto.guessdastuff.exceptions.CategoryException;
// import tec.proyecto.guessdastuff.repositories.CategoryRepository;
// import tec.proyecto.guessdastuff.services.CategoryService;

// class CategoryServiceTest {

//     @InjectMocks
//     private CategoryService categoryService;

//     @Mock
//     private CategoryRepository categoryRepository;

//     @Mock
//     private CategoryConverter categoryConverter;

//     @BeforeEach
//     void setUp() {
//         MockitoAnnotations.openMocks(this);
//     }

//     @Test
//     void addCategory_Success() throws CategoryException {
//         DtoCategory dtoCategory = new DtoCategory("New Category", "Description", "URL", ECategoryStatus.EMPTY);
//         Category category = new Category(1L, "New Category", "Description", "URL", ECategoryStatus.EMPTY);

//         when(categoryConverter.toEntity(dtoCategory)).thenReturn(category);
//         when(categoryRepository.findByName(category.getName())).thenReturn(Optional.empty());
//         when(categoryRepository.save(category)).thenReturn(category);

//         ResponseEntity<?> response = categoryService.addCategory(dtoCategory);

//         assertEquals("Categoria con id 1 creada correctamente", response.getBody());
//         verify(categoryRepository, times(1)).save(category);
//     }

//     @Test
//     void getCategoryByName_Success() throws CategoryException {
//         Category category = new Category(1L, "Test Category", "Description", "URL", ECategoryStatus.INITIALIZED);

//         when(categoryRepository.findByName("Test Category")).thenReturn(Optional.of(category));

//         Category result = categoryService.getCategoryByName("Test Category");

//         assertEquals(category, result);
//     }

//     @Test
//     void getAllCategories_Success() throws CategoryException {
//         Category category1 = new Category(1L, "Category1", "Description1", "URL1", ECategoryStatus.INITIALIZED);
//         Category category2 = new Category(2L, "Category2", "Description2", "URL2", ECategoryStatus.INITIALIZED);

//         when(categoryRepository.findAll()).thenReturn(Arrays.asList(category1, category2));

//         List<Category> result = categoryService.getAllCategories();

//         assertEquals(2, result.size());
//         assertEquals(category1, result.get(0));
//         assertEquals(category2, result.get(1));
//     }

//     @Test
//     void getActiveCategories_Success() throws CategoryException {
//         Category category1 = new Category(1L, "Active1", "Description1", "URL1", ECategoryStatus.INITIALIZED);
//         Category category2 = new Category(2L, "Active2", "Description2", "URL2", ECategoryStatus.INITIALIZED);

//         when(categoryRepository.findAll()).thenReturn(Arrays.asList(category1, category2));

//         List<Category> result = categoryService.getActiveCategories();

//         assertEquals(2, result.size());
//         assertEquals(category1, result.get(0));
//         assertEquals(category2, result.get(1));
//     }

//     @Test
//     void getAvailableCategories_Success() throws CategoryException {
//         Category category1 = new Category(1L, "Available1", "Description1", "URL1", ECategoryStatus.INITIALIZED);
//         Category category2 = new Category(2L, "Available2", "Description2", "URL2", ECategoryStatus.EMPTY);

//         when(categoryRepository.findAll()).thenReturn(Arrays.asList(category1, category2));

//         List<Category> result = categoryService.getAvailabeCategories();

//         assertEquals(2, result.size());
//         assertEquals(category1, result.get(0));
//         assertEquals(category2, result.get(1));
//     }

//     @Test
//     void editCategory_Success() throws CategoryException {
//         Category category = new Category(1L, "Existing Category", "Old Description", "Old URL", ECategoryStatus.INITIALIZED);
//         DtoCategoryRequest dtoCategoryRequest = new DtoCategoryRequest();
//         dtoCategoryRequest.setDescription("Some description");
//         dtoCategoryRequest.setUrlIcon("Some URL");
//         dtoCategoryRequest.setStatus(ECategoryStatus.INITIALIZED);

//         when(categoryRepository.findByName("Existing Category")).thenReturn(Optional.of(category));
//         when(categoryRepository.save(category)).thenReturn(category);

//         ResponseEntity<?> response = categoryService.editCategory("Existing Category", dtoCategoryRequest);

//         assertEquals("La categoria Existing Category ha sido editada correctamente!", response.getBody());
//         verify(categoryRepository, times(1)).save(category);
//     }

//     @Test
//     void deleteCategory_Success() throws CategoryException {
//         Category category = new Category(1L, "Delete Category", "Description", "URL", ECategoryStatus.INITIALIZED);

//         when(categoryRepository.findByName("Delete Category")).thenReturn(Optional.of(category));
//         when(categoryRepository.save(category)).thenReturn(category);

//         ResponseEntity<?> response = categoryService.deleteCategory("Delete Category");

//         assertEquals("La categoria Delete Category ha sido eliminada de forma exitosa!", response.getBody());
//         verify(categoryRepository, times(1)).save(category);
//     }
// }
