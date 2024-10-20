package tec.proyecto.guessdastuff.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tec.proyecto.guessdastuff.entities.OrderByDate;

@Repository
public interface OrderByDateRepository extends JpaRepository<OrderByDate, Long>{

    // Funcion para verificar la existencia por categoría y evento
    boolean existsByCategoryIdAndEvent(Long idCategory, String event);
    
} 