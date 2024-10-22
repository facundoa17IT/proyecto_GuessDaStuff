package tec.proyecto.guessdastuff.services;


import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import tec.proyecto.guessdastuff.converters.CategoryConverter;
import tec.proyecto.guessdastuff.dtos.DtoCategory;
import tec.proyecto.guessdastuff.entities.Category;
import tec.proyecto.guessdastuff.exceptions.CategoryException;
import tec.proyecto.guessdastuff.repositories.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    CategoryConverter categoryConverter;

    @Autowired
    CategoryRepository categoryRepository;
    
    public ResponseEntity<?> addCategory(DtoCategory dtoCategory) throws CategoryException{
        Category category = categoryConverter.toEntity(dtoCategory);
        Optional<Category> categoryOpt = categoryRepository.findByName(category.getName());
        if (categoryOpt.isPresent()){
            throw new CategoryException("Ya existe una categoria con nombre " + category.getName());
        }
        categoryRepository.save(category);
        return ResponseEntity.ok("Categoria con id " + category.getId() + " creada correctamente"); 
    }

    public ResponseEntity<?> getCategoryByName(String name) throws CategoryException{
        Optional<Category> categoryOpt = categoryRepository.findByName(name);
        if (!categoryOpt.isPresent()){
            throw new CategoryException("No existe una categoria con nombre " + name);
        }
        DtoCategory  dtoCategory = categoryConverter.toDto(categoryOpt.get());
        return ResponseEntity.ok(dtoCategory);
    }

    public List<Category> getCategory() throws CategoryException {
        List<Category> categoryResponse = categoryRepository.findAll();
        if (categoryResponse == null || categoryResponse.isEmpty()) {
            throw new CategoryException("No existen categorías con el filtro proporcionado.");
        }
        return categoryResponse;
    }

    public ResponseEntity<?> getActiveCategories() throws CategoryException{
        List<Category> categoriesActives = categoryRepository.findAll().stream().filter(Category:: isActive).toList();
        if (categoriesActives.isEmpty()) {
            throw new CategoryException("No hay categorias activas"); 
        }
        return ResponseEntity.ok(categoriesActives);
    }

    public ResponseEntity<?> editCategory(DtoCategory dtoCategory) throws CategoryException{
        Optional<Category> categoryOpt = categoryRepository.findByName(dtoCategory.getName());
        if (!categoryOpt.isPresent()){
            throw new CategoryException("No existe una categoria con nombre " + dtoCategory.getName());
        }
        Category category = categoryOpt.get();
        category.setDescription(dtoCategory.getDescription());
        category.setUrlIcon(dtoCategory.getUrlIcon());
        category.setActive(dtoCategory.isActive());
        categoryRepository.save(category);

        return ResponseEntity.ok("La categoria " + category.getName() + " ha sido editada correctamente!");
    }
    
    public ResponseEntity<?> deleteCategory(String name) throws CategoryException{
        Optional<Category> categoryOpt = categoryRepository.findByName(name);
        if (!categoryOpt.isPresent()){
            throw new CategoryException("No existe una categoria con nombre " + name);
        }
        Category category = categoryOpt.get();
        category.setActive(false);
        categoryRepository.save(category);
        return ResponseEntity.ok("La categoria " + name + " ha sido eliminada de forma exitosa!");
    }

}
