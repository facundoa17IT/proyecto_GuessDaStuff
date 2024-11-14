package tec.proyecto.guessdastuff;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import tec.proyecto.guessdastuff.dtos.DtoCategory;
import tec.proyecto.guessdastuff.dtos.DtoCategoryRequest;
import tec.proyecto.guessdastuff.enums.ECategoryStatus;
import tec.proyecto.guessdastuff.exceptions.CategoryException;
import tec.proyecto.guessdastuff.services.CategoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import tec.proyecto.guessdastuff.controllers.CategoryController;

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

        // Mock the service call to return a ResponseEntity containing the success message
        when(categoryService.addCategory(dtoCategory))
                .thenReturn(ResponseEntity.ok("Categoria con id 1 creada correctamente"));

        // Perform the mock HTTP POST request
        mockMvc.perform(post("/api/v1/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtoCategory)))
                .andExpect(status().isOk())
                .andExpect(content().string("Categoria con id 1 creada correctamente"));
    }





    @Test
    void getCategoryByName_Success() throws Exception {
        DtoCategory dtoCategory = new DtoCategory("Test Category", "Description", "URL", ECategoryStatus.INITIALIZED);

        when(categoryService.getCategoryByName("Test Category")).thenReturn(dtoCategory);

        mockMvc.perform(get("/api/v1/categories/Test Category"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Category"));
    }

    @Test
    void getAllCategories_Success() throws Exception {
        DtoCategory category1 = new DtoCategory("Category1", "Description1", "URL1", ECategoryStatus.INITIALIZED);
        DtoCategory category2 = new DtoCategory("Category2", "Description2", "URL2", ECategoryStatus.INITIALIZED);

        when(categoryService.getAllCategories()).thenReturn(List.of(category1, category2));

        mockMvc.perform(get("/api/v1/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2));
    }

    @Test
    void editCategory_Success() throws Exception {
        DtoCategoryRequest dtoCategoryRequest = new DtoCategoryRequest();
        dtoCategoryRequest.setDescription("Updated description");
        dtoCategoryRequest.setUrlIcon("Updated URL");

        when(categoryService.editCategory(eq("Existing Category"), any(DtoCategoryRequest.class)))
                .thenReturn("La categoria Existing Category ha sido editada correctamente!");

        mockMvc.perform(put("/api/v1/categories/edit/Existing Category")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dtoCategoryRequest)))
                .andExpect(status().isOk())
                .andExpect(content().string("La categoria Existing Category ha sido editada correctamente!"));
    }

    @Test
    void deleteCategory_Success() throws Exception {
        when(categoryService.deleteCategory("Delete Category"))
                .thenReturn("La categoria Delete Category ha sido eliminada de forma exitosa!");

        mockMvc.perform(put("/api/v1/categories/delete/Delete Category"))
                .andExpect(status().isOk())
                .andExpect(content().string("La categoria Delete Category ha sido eliminada de forma exitosa!"));
    }
}
