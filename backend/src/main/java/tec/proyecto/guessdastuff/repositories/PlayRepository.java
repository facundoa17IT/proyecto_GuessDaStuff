package tec.proyecto.guessdastuff.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import tec.proyecto.guessdastuff.entities.Game;

import java.util.List;

@Repository
public interface PlayRepository extends JpaRepository<Game, Long> {

    @Query(value = "SELECT c.name AS category, ARRAY_AGG(gm.name) AS game_modes " +
                   "FROM games g " +
                   "JOIN category c ON g.id_category = c.id " +
                   "JOIN game_mode gm ON g.id_game_mode = gm.name " +
                   "WHERE c.id IN (:categories) " +
                   "GROUP BY c.name", 
           nativeQuery = true)
    List<Object[]> loadGameByCategories(List<Integer> categories);
}
