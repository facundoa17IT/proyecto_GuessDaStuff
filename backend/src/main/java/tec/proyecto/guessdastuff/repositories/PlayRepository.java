package tec.proyecto.guessdastuff.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import tec.proyecto.guessdastuff.entities.Game;

import java.util.List;

@Repository
public interface PlayRepository extends JpaRepository<Game, Long> {

    @Query(value = "SELECT c.name AS category, ARRAY_AGG(DISTINCT gm.name) AS game_modes " +
                   "FROM games g " +
                   "JOIN category c ON g.id_category = c.id " +
                   "JOIN game_mode gm ON g.id_game_mode = gm.name " +
                   "WHERE c.id IN (:categories) " +
                   "GROUP BY c.name", 
           nativeQuery = true)
    List<Object[]> loadGameByCategories(List<Integer> categories);

    @Query(value = "SELECT g.id, gm.name AS game_mode, c.name AS category, g.event, g.hint1, g.hint2, g.hint3, g.start_date, g.end_date, g.info_event " +
               "FROM games g " +
               "JOIN category c ON g.id_category = c.id " +
               "JOIN game_mode gm ON g.id_game_mode = gm.name " +
               "WHERE (c.id = :cat1 AND gm.name = :mod1) " +
               "OR (c.id = :cat2 AND gm.name = :mod2) " +
               "OR (c.id = :cat3 AND gm.name = :mod3)", 
       nativeQuery = true)
    List<Object[]> findGamesByCategoriesAndModes(Integer cat1, String mod1, Integer cat2, String mod2, Integer cat3, String mod3);


    // Consulta para obtener una tupla aleatoria entre las que coinciden
    @Query(value = "WITH selected_events AS ( " +
                   "SELECT * FROM games WHERE id_game_mode = 'OBD' AND id_category = :idCategory " +
                   "AND start_date IS DISTINCT FROM end_date " +
                   "ORDER BY RANDOM() LIMIT 1) " +
                   "SELECT * FROM games " +
                   "WHERE id_game_mode = 'OBD' AND id_category = :idCategory " +
                   "AND start_date IS DISTINCT FROM end_date " +
                   "AND NOT EXISTS ( " +
                   "SELECT 1 FROM selected_events se WHERE " +
                   "games.start_date BETWEEN se.start_date AND se.end_date OR " +
                   "games.end_date BETWEEN se.start_date AND se.end_date OR " +
                   "(games.start_date <= se.start_date AND games.end_date >= se.end_date)) " +
                   "ORDER BY RANDOM() LIMIT 3", 
           nativeQuery = true)
           List<Object[]> findOBD(Integer idCategory);

        @Query(value = "SELECT * " +
                "FROM games " +
                "WHERE id_game_mode = 'OW' " +
                "AND id_category = :idCategory " +
                "ORDER BY RANDOM() " +
                "LIMIT 1;", 
        nativeQuery = true)
        List<Object[]> findOW(Integer idCategory);

        @Query(value = "SELECT * " +
                "FROM games " +
                "WHERE id_game_mode = 'GP' " +
                "AND id_category = :idCategory " +
                "ORDER BY RANDOM() " +
                "LIMIT 1;", 
        nativeQuery = true)
        List<Object[]> findGP(Integer idCategory);

}
