package tec.proyecto.guessdastuff.converters;

import org.springframework.stereotype.Component;

import tec.proyecto.guessdastuff.dtos.DtoCategory;
import tec.proyecto.guessdastuff.entities.Category;

@Component
public class CategoryConverter {
    
    public Category toEntity(DtoCategory dt){
        Category category = new Category(null, dt.getName(), dt.getUrlIcon(), dt.getDescription(), dt.getStatus());
        return category;
    }

    public DtoCategory toDto(Category category){
        DtoCategory dtoCategory = new DtoCategory(category.getName(), category.getDescription(), category.getUrlIcon(), category.getStatus());
        return dtoCategory;
    }

}
