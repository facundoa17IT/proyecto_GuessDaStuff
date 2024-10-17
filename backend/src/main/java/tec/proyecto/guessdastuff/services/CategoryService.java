package tec.proyecto.guessdastuff.services;


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


}