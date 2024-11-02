package tec.proyecto.guessdastuff.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import tec.proyecto.guessdastuff.dtos.DtoCategoryRequest;
import tec.proyecto.guessdastuff.dtos.DtoCategory;
import tec.proyecto.guessdastuff.exceptions.CategoryException;
import tec.proyecto.guessdastuff.services.CategoryService;

@CrossOrigin(origins = "http://localhost:5173/")
@RequestMapping("/api")
@RestController
@RequiredArgsConstructor
public class CategoryController {

    @Autowired
    CategoryService categoryService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/v1/categories")
    public ResponseEntity<?> addCategory(@RequestBody DtoCategory dtoCategory)throws CategoryException{
        try {
            return ResponseEntity.ok(categoryService.addCategory(dtoCategory));
        } catch (Exception e) {
            return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/v1/categories/{name}")
    public ResponseEntity<?> getCategoryByName(@PathVariable String name) throws CategoryException{
        try {
            return ResponseEntity.ok(categoryService.getCategoryByName(name));
        } catch (Exception e) {
            return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/v1/categories")
    public ResponseEntity<?> getAllCategories() throws CategoryException{
        try {
            return ResponseEntity.ok(categoryService.getAllCategories());
        } catch (Exception e) {
            return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/v1/categories/edit/{name}")
    public ResponseEntity<?> editCategory(@PathVariable String name, @RequestBody DtoCategoryRequest dtoCategory) throws CategoryException{
        try {
            return ResponseEntity.ok(categoryService.editCategory(name, dtoCategory));
        } catch (Exception e) {
            return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/v1/categories-active")
    public ResponseEntity<?> getActiveCategories() throws CategoryException{
        try {
            return ResponseEntity.ok(categoryService.getActiveCategories());
        } catch (Exception e) {
            return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/v1/categories-availables")
    public ResponseEntity<?> getAvailableCategories() throws CategoryException{
        try {
            return ResponseEntity.ok(categoryService.getAvailabeCategories());
        } catch (Exception e) {
            return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/v1/categories/delete/{name}")
    public ResponseEntity<?> deleteCategory(@PathVariable String name)  throws CategoryException{
        try {
            return ResponseEntity.ok(categoryService.deleteCategory(name));
        } catch (Exception e) {
            return  ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
