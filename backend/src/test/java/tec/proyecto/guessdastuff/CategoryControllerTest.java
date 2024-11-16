/*package tec.proyecto.guessdastuff;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import tec.proyecto.guessdastuff.dtos.DtoCategory;
import tec.proyecto.guessdastuff.dtos.DtoCategoryRequest;
import tec.proyecto.guessdastuff.enums.ECategoryStatus;
import tec.proyecto.guessdastuff.services.CategoryService;
import tec.proyecto.guessdastuff.controllers.CategoryController;
import tec.proyecto.guessdastuff.entities.Category;

import java.util.List;

@WebMvcTest(CategoryController.class)
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CategoryService categoryService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void addCategory_Success() throws Exception {
        DtoCategory dtoCategory = new DtoCategory("New Category", "Description", "URL", ECategoryStatus.EMPTY);

        // Use doAnswer to simulate method behavior without needing thenReturn
        doAnswer(invocation -> {
            DtoCategory argument = invocation.getArgument(0);
            // Simulate success response from service method
            return ResponseEntity.ok("Categoria con id 1 creada correctamente");
        }).when(categoryService).addCategory(any(DtoCategory.class));

        // Perform the mock HTTP POST request
        mockMvc.perform(post("/api/v1/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtoCategory)))
                .andExpect(status().isOk())
                .andExpect(content().string("Categoria con id 1 creada correctamente"));

        // Verify that the service was called once
        verify(categoryService, times(1)).addCategory(any(DtoCategory.class));
    }

    @Test
    void getCategoryByName_Success() throws Exception {
        // Create a Category object (not DtoCategory)
        Category category = new Category();
        category.setName("Test Category");
        category.setDescription("Description");
        category.setUrlIcon("URL");
        category.setStatus(ECategoryStatus.INITIALIZED);
    
        // Mock the service to return a Category object
        when(categoryService.getCategoryByName("Test Category"))
                .thenReturn(category);
    
        mockMvc.perform(get("/api/v1/categories/Test Category"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Category"));
    
        verify(categoryService, times(1)).getCategoryByName("Test Category");
    }
    
    @Test
    void getAllCategories_Success() throws Exception {
        // Create Category objects for the response
        Category category1 = new Category();
        category1.setName("Category1");
        category1.setDescription("Description1");
        category1.setUrlIcon("URL1");
        category1.setStatus(ECategoryStatus.INITIALIZED);
    
        Category category2 = new Category();
        category2.setName("Category2");
        category2.setDescription("Description2");
        category2.setUrlIcon("URL2");
        category2.setStatus(ECategoryStatus.INITIALIZED);
    
        // Mock the service to return a list of Category objects
        when(categoryService.getAllCategories())
                .thenReturn(List.of(category1, category2));
    
        mockMvc.perform(get("/api/v1/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2));
    
        verify(categoryService, times(1)).getAllCategories();
    }
    

    @Test
    void editCategory_Success() throws Exception {
        DtoCategoryRequest dtoCategoryRequest = new DtoCategoryRequest();
        dtoCategoryRequest.setDescription("Updated description");
        dtoCategoryRequest.setUrlIcon("Updated URL");

        doAnswer(invocation -> {
            // Simulate success response
            return ResponseEntity.ok("La categoria Existing Category ha sido editada correctamente!");
        }).when(categoryService).editCategory(eq("Existing Category"), any(DtoCategoryRequest.class));

        mockMvc.perform(put("/api/v1/categories/edit/Existing Category")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtoCategoryRequest)))
                .andExpect(status().isOk())
                .andExpect(content().string("La categoria Existing Category ha sido editada correctamente!"));

        verify(categoryService, times(1)).editCategory(eq("Existing Category"), any(DtoCategoryRequest.class));
    }

    @Test
    void deleteCategory_Success() throws Exception {
        doAnswer(invocation -> {
            // Simulate success response
            return ResponseEntity.ok("La categoria Delete Category ha sido eliminada de forma exitosa!");
        }).when(categoryService).deleteCategory("Delete Category");

        mockMvc.perform(put("/api/v1/categories/delete/Delete Category"))
                .andExpect(status().isOk())
                .andExpect(content().string("La categoria Delete Category ha sido eliminada de forma exitosa!"));

        verify(categoryService, times(1)).deleteCategory("Delete Category");
    }
}
*/