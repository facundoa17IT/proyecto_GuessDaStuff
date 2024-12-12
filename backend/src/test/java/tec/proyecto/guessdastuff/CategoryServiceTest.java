package tec.proyecto.guessdastuff;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import tec.proyecto.guessdastuff.converters.CategoryConverter;
import tec.proyecto.guessdastuff.dtos.DtoCategory;
import tec.proyecto.guessdastuff.dtos.DtoCategoryRequest;
import tec.proyecto.guessdastuff.entities.Category;
import tec.proyecto.guessdastuff.enums.ECategoryStatus;
import tec.proyecto.guessdastuff.exceptions.CategoryException;
import tec.proyecto.guessdastuff.repositories.CategoryRepository;
import tec.proyecto.guessdastuff.services.CategoryService;

class CategoryServiceTest {

    @InjectMocks
    private CategoryService categoryService;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryConverter categoryConverter;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    //Agrega Categoria Exito
    @Test
    void addCategory_Success() throws CategoryException {
        DtoCategory dtoCategory = new DtoCategory("New Category", "Description", "URL", ECategoryStatus.EMPTY);
        Category category = new Category(1L, "New Category", "Description", "URL", ECategoryStatus.EMPTY);

        when(categoryConverter.toEntity(dtoCategory)).thenReturn(category);
        when(categoryRepository.findByName(category.getName())).thenReturn(Optional.empty());
        when(categoryRepository.save(category)).thenReturn(category);

        ResponseEntity<?> response = categoryService.addCategory(dtoCategory);

        assertEquals("Categoria con id 1 creada correctamente", response.getBody());
        verify(categoryRepository, times(1)).save(category);
    }

    //La Categoria ya existe
    @Test
    void addCategory_ExistingCategory_ThrowsException() {
    // Given: Un DtoCategory con un nombre ya existente
    DtoCategory dtoCategory = new DtoCategory();
    dtoCategory.setName("ExistingCategory");
    
    Category existingCategory = new Category();
    existingCategory.setName("ExistingCategory");
    
    // Mockear el comportamiento de categoryRepository y categoryConverter
    when(categoryConverter.toEntity(dtoCategory)).thenReturn(existingCategory);
    when(categoryRepository.findByName("ExistingCategory")).thenReturn(Optional.of(existingCategory));
    
    // When y Then: Llamar a addCategory y verificar que lanza CategoryException
    CategoryException exception = assertThrows(CategoryException.class, () -> {
        categoryService.addCategory(dtoCategory);
    });
    
    assertEquals("Ya existe una categoria con nombre ExistingCategory", exception.getMessage());
    
    // Verificar interacciones con los mocks
    verify(categoryConverter).toEntity(dtoCategory);
    verify(categoryRepository).findByName("ExistingCategory");
    verifyNoMoreInteractions(categoryRepository);
    }

    //Encuentra la Categoria por nombre Exito
    @Test
    void getCategoryByName_Success() throws CategoryException {
        Category category = new Category(1L, "Test Category", "Description", "URL", ECategoryStatus.INITIALIZED);

        when(categoryRepository.findByName("Test Category")).thenReturn(Optional.of(category));

        Category result = categoryService.getCategoryByName("Test Category");

        assertEquals(category, result);
    }

    //No encuentra la Categoria
    @Test
    void getCategoryByName_NotFound_ThrowsException() {
    // Given: Un nombre de categoría que no existe
    String categoryName = "NonExistentCategory";

    // Mockear el comportamiento de categoryRepository para que devuelva un Optional vacío
    when(categoryRepository.findByName(categoryName)).thenReturn(Optional.empty());

    // When y Then: Llamar a getCategoryByName y verificar que lanza CategoryException
    CategoryException exception = assertThrows(CategoryException.class, () -> {
        categoryService.getCategoryByName(categoryName);
    });

    assertEquals("No existe una categoria con nombre " + categoryName, exception.getMessage());

    // Verificar interacciones con los mocks
    verify(categoryRepository).findByName(categoryName);
    verifyNoMoreInteractions(categoryRepository);
}

    @Test
    void getAllCategories_Success() throws CategoryException {
        Category category1 = new Category(1L, "Category1", "Description1", "URL1", ECategoryStatus.INITIALIZED);
        Category category2 = new Category(2L, "Category2", "Description2", "URL2", ECategoryStatus.INITIALIZED);

        when(categoryRepository.findAll()).thenReturn(Arrays.asList(category1, category2));

        List<Category> result = categoryService.getAllCategories();

        assertEquals(2, result.size());
        assertEquals(category1, result.get(0));
        assertEquals(category2, result.get(1));
    }

    //No existen Categorias
    @Test
    void getAllCategories_NoCategories_ThrowsException() {
    // Given: El repositorio no tiene categorías (devuelve una lista vacía)
    when(categoryRepository.findAll()).thenReturn(List.of());

    // When y Then: Llamar a getAllCategories y verificar que lanza CategoryException
    CategoryException exception = assertThrows(CategoryException.class, () -> {
        categoryService.getAllCategories();
    });

    assertEquals("No existen categorías con el filtro proporcionado.", exception.getMessage());

    // Verificar interacciones con los mocks
    verify(categoryRepository).findAll();
    verifyNoMoreInteractions(categoryRepository);
    }

    //Categorias activas exito
    @Test
    void getActiveCategories_Success() throws CategoryException {
        Category category1 = new Category(1L, "Active1", "Description1", "URL1", ECategoryStatus.INITIALIZED);
        Category category2 = new Category(2L, "Active2", "Description2", "URL2", ECategoryStatus.INITIALIZED);

        when(categoryRepository.findAll()).thenReturn(Arrays.asList(category1, category2));

        List<Category> result = categoryService.getActiveCategories();

        assertEquals(2, result.size());
        assertEquals(category1, result.get(0));
        assertEquals(category2, result.get(1));
    }

    //No hay Categorias activas
    @Test
    void getActiveCategories_NoActiveCategories_ThrowsException() {
    // Given: El repositorio no tiene categorías activas (estado INITIALIZED)
    List<Category> allCategories = List.of(
        new Category(1L, "Cat1", "Icon1", "Desc1", ECategoryStatus.EMPTY), // Cambiar 1 a 1L
        new Category(2L, "Cat2", "Icon2", "Desc2", ECategoryStatus.DELETED) // Cambiar 2 a 2L
    );
    when(categoryRepository.findAll()).thenReturn(allCategories);

    // When y Then: Llamar a getActiveCategories y verificar que lanza CategoryException
    CategoryException exception = assertThrows(CategoryException.class, () -> {
        categoryService.getActiveCategories();
    });

    assertEquals("No hay categorias activas", exception.getMessage());

    // Verificar interacciones con los mocks
    verify(categoryRepository).findAll();
    verifyNoMoreInteractions(categoryRepository);
    }

    @Test
    void getAvailableCategories_Success() throws CategoryException {
        Category category1 = new Category(1L, "Available1", "Description1", "URL1", ECategoryStatus.INITIALIZED);
        Category category2 = new Category(2L, "Available2", "Description2", "URL2", ECategoryStatus.EMPTY);

        when(categoryRepository.findAll()).thenReturn(Arrays.asList(category1, category2));

        List<Category> result = categoryService.getAvailabeCategories();

        assertEquals(2, result.size());
        assertEquals(category1, result.get(0));
        assertEquals(category2, result.get(1));
    }

    //Editar Categorias exito
    @Test
    void editCategory_Success() throws CategoryException {
        Category category = new Category(1L, "Existing Category", "Old Description", "Old URL", ECategoryStatus.INITIALIZED);
        DtoCategoryRequest dtoCategoryRequest = new DtoCategoryRequest();
        dtoCategoryRequest.setDescription("Some description");
        dtoCategoryRequest.setUrlIcon("Some URL");
        dtoCategoryRequest.setStatus(ECategoryStatus.INITIALIZED);

        when(categoryRepository.findByName("Existing Category")).thenReturn(Optional.of(category));
        when(categoryRepository.save(category)).thenReturn(category);

        ResponseEntity<?> response = categoryService.editCategory("Existing Category", dtoCategoryRequest);

        assertEquals("La categoria Existing Category ha sido editada correctamente!", response.getBody());
        verify(categoryRepository, times(1)).save(category);
    }

    //Editar Catergoria que no existe
    @Test
    void editCategory_CategoryNotFound_ThrowsCategoryException() {
    // Given: El repositorio no tiene ninguna categoría con el nombre "NonExistingCategory"
    String nonExistingCategoryName = "NonExistingCategory";
    DtoCategoryRequest dtoCategoryRequest = new DtoCategoryRequest("New Description", "new-url-icon", ECategoryStatus.EMPTY);

    when(categoryRepository.findByName(nonExistingCategoryName)).thenReturn(Optional.empty());

    // When y Then: Llamar a editCategory y verificar que lanza CategoryException
    CategoryException exception = assertThrows(CategoryException.class, () -> {
        categoryService.editCategory(nonExistingCategoryName, dtoCategoryRequest);
    });

    // Verificar que el mensaje de la excepción es el esperado
    assertEquals("No existe una categoria con nombre " + nonExistingCategoryName, exception.getMessage());

    // Verificar que el método findByName fue llamado con el nombre adecuado
    verify(categoryRepository).findByName(nonExistingCategoryName);
    verifyNoMoreInteractions(categoryRepository);
    }

    @Test
    void deleteCategory_Success() throws CategoryException {
        Category category = new Category(1L, "Delete Category", "Description", "URL", ECategoryStatus.INITIALIZED);

        when(categoryRepository.findByName("Delete Category")).thenReturn(Optional.of(category));
        when(categoryRepository.save(category)).thenReturn(category);

        ResponseEntity<?> response = categoryService.deleteCategory("Delete Category");

        assertEquals("La categoria Delete Category ha sido eliminada de forma exitosa!", response.getBody());
        verify(categoryRepository, times(1)).save(category);
    }

    //Borrar Categoria que no existe
    @Test
    void deleteCategory_CategoryNotFound_ThrowsCategoryException() {
    // Given: El repositorio no tiene ninguna categoría con el nombre "NonExistingCategory"
    String nonExistingCategoryName = "NonExistingCategory";

    when(categoryRepository.findByName(nonExistingCategoryName)).thenReturn(Optional.empty());

    // When y Then: Llamar a deleteCategory y verificar que lanza CategoryException
    CategoryException exception = assertThrows(CategoryException.class, () -> {
        categoryService.deleteCategory(nonExistingCategoryName);
    });

    // Verificar que el mensaje de la excepción es el esperado
    assertEquals("No existe una categoria con nombre " + nonExistingCategoryName, exception.getMessage());

    // Verificar que el método findByName fue llamado con el nombre adecuado
    verify(categoryRepository).findByName(nonExistingCategoryName);
    verifyNoMoreInteractions(categoryRepository);
    }
}
