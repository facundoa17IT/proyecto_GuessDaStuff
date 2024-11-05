package tec.proyecto.guessdastuff.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import tec.proyecto.guessdastuff.converters.CategoryConverter;
import tec.proyecto.guessdastuff.dtos.DtoCategory;
import tec.proyecto.guessdastuff.dtos.DtoCategoryRequest;
import tec.proyecto.guessdastuff.entities.Category;
import tec.proyecto.guessdastuff.enums.ECategoryStatus;
import tec.proyecto.guessdastuff.exceptions.CategoryException;
import tec.proyecto.guessdastuff.repositories.CategoryRepository;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @InjectMocks
    private CategoryService categoryService;

    @Mock
    private CategoryConverter categoryConverter;

    @Mock
    private CategoryRepository categoryRepository;

    private DtoCategory dtoCategory;
    private DtoCategoryRequest dtoCategoryRequest;
    private Category category;

    @BeforeEach
    public void setUp() {
        dtoCategory = new DtoCategory();
        dtoCategory.setName("Test Category");
        dtoCategoryRequest = new DtoCategoryRequest();
        dtoCategoryRequest.setDescription("Test Description");
        dtoCategoryRequest.setUrlIcon("http://test.com/icon.png");

        category = new Category();
        category.setId(1L);
        category.setName("Test Category");
        category.setStatus(ECategoryStatus.INITIALIZED);
    }

    @Test
    public void testAddCategory_Success() throws CategoryException {
        when(categoryConverter.toEntity(dtoCategory)).thenReturn(category);
        when(categoryRepository.findByName(category.getName())).thenReturn(Optional.empty());

        ResponseEntity<?> response = categoryService.addCategory(dtoCategory);

        assertEquals("Categoria con id 1 creada correctamente", response.getBody());
        verify(categoryRepository, times(1)).save(category);
    }

    @Test
    public void testAddCategory_CategoryExists() {
        when(categoryConverter.toEntity(dtoCategory)).thenReturn(category);
        when(categoryRepository.findByName(category.getName())).thenReturn(Optional.of(category));

        Exception exception = assertThrows(CategoryException.class, () -> {
            categoryService.addCategory(dtoCategory);
        });

        assertEquals("Ya existe una categoria con nombre Test Category", exception.getMessage());
    }

    @Test
    public void testGetCategoryByName_Success() throws CategoryException {
        when(categoryRepository.findByName("Test Category")).thenReturn(Optional.of(category));

        Category result = categoryService.getCategoryByName("Test Category");

        assertEquals(category, result);
    }

    @Test
    public void testGetCategoryByName_NotFound() {
        when(categoryRepository.findByName("Test Category")).thenReturn(Optional.empty());

        Exception exception = assertThrows(CategoryException.class, () -> {
            categoryService.getCategoryByName("Test Category");
        });

        assertEquals("No existe una categoria con nombre Test Category", exception.getMessage());
    }

    @Test
    public void testGetAllCategories_Success() throws CategoryException {
        when(categoryRepository.findAll()).thenReturn(Arrays.asList(category));

        List<Category> result = categoryService.getAllCategories();

        assertEquals(1, result.size());
        assertEquals(category, result.get(0));
    }

    @Test
    public void testGetAllCategories_Empty() {
        when(categoryRepository.findAll()).thenReturn(Arrays.asList());

        Exception exception = assertThrows(CategoryException.class, () -> {
            categoryService.getAllCategories();
        });

        assertEquals("No existen categorías con el filtro proporcionado.", exception.getMessage());
    }

    @Test
    public void testGetActiveCategories_Success() throws CategoryException {
        when(categoryRepository.findAll()).thenReturn(Arrays.asList(category));

        List<Category> result = categoryService.getActiveCategories();

        assertEquals(1, result.size());
        assertEquals(category, result.get(0));
    }

    @Test
    public void testGetActiveCategories_NoActive() {
        category.setStatus(ECategoryStatus.EMPTY);
        when(categoryRepository.findAll()).thenReturn(Arrays.asList(category));

        Exception exception = assertThrows(CategoryException.class, () -> {
            categoryService.getActiveCategories();
        });

        assertEquals("No hay categorias activas", exception.getMessage());
    }

    @Test
    public void testEditCategory_Success() throws CategoryException {
        when(categoryRepository.findByName("Test Category")).thenReturn(Optional.of(category));

        ResponseEntity<?> response = categoryService.editCategory("Test Category", dtoCategoryRequest);

        assertEquals("La categoria Test Category ha sido editada correctamente!", response.getBody());
        verify(categoryRepository, times(1)).save(category);
    }

    @Test
    public void testEditCategory_NotFound() {
        when(categoryRepository.findByName("Test Category")).thenReturn(Optional.empty());

        Exception exception = assertThrows(CategoryException.class, () -> {
            categoryService.editCategory("Test Category", dtoCategoryRequest);
        });

        assertEquals("No existe una categoria con nombre Test Category", exception.getMessage());
    }

    @Test
    public void testDeleteCategory_Success() throws CategoryException {
        when(categoryRepository.findByName("Test Category")).thenReturn(Optional.of(category));

        ResponseEntity<?> response = categoryService.deleteCategory("Test Category");

        assertEquals("La categoria Test Category ha sido eliminada de forma exitosa!", response.getBody());
        verify(categoryRepository, times(1)).save(category);
    }

    @Test
    public void testDeleteCategory_NotFound() {
        when(categoryRepository.findByName("Test Category")).thenReturn(Optional.empty());

        Exception exception = assertThrows(CategoryException.class, () -> {
            categoryService.deleteCategory("Test Category");
        });

        assertEquals("No existe una categoria con nombre Test Category", exception.getMessage());
    }
}
