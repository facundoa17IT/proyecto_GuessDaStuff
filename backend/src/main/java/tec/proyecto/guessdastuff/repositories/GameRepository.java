package tec.proyecto.guessdastuff.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import tec.proyecto.guessdastuff.entities.Game;

@Repository
public interface GameRepository extends JpaRepository<Game, Long>{

   @Query(value = """
    SELECT gm.description AS gameMode, 
           CASE 
               WHEN g.id_game_mode = 'MC' THEN g.question 
               WHEN g.id_game_mode = 'GP' THEN g.phrase 
               ELSE g.word 
           END AS titulo,
           g.id
    FROM games g
    INNER JOIN game_mode gm ON g.id_game_mode = gm.name
    WHERE g.id_category = :idCategory
    """, nativeQuery = true)
    List<Object[]> listTitlesOfCategory(Long idCategory);

    
} 