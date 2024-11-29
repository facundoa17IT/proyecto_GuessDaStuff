package tec.proyecto.guessdastuff.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;

import tec.proyecto.guessdastuff.entities.DataGameSingle;

@Repository
public interface DataGameSingleRepository extends JpaRepository<DataGameSingle, String> {

    @Modifying
    @Transactional
    @Query("UPDATE DataGameSingle d SET d.points = d.points + ?2, d.timePlaying = d.timePlaying + ?3 WHERE d.id = ?1")
    void updateDataGame(String idGameSingle, int points, float timePlaying);

    @Modifying
    @Transactional
    @Query("UPDATE DataGameSingle d SET d.tmstmpInit = CURRENT_TIMESTAMP WHERE d.id = ?1")
    void initPlayGame(String idGameSingle);

    @Modifying
    @Transactional
    @Query("UPDATE DataGameSingle d SET d.isFinish = true WHERE d.id = ?1")
    void finishPlayGame(String idGameSingle);

    @Query(value = """
    SELECT  s.id AS id_game, g1.dtype AS game1, g2.dtype AS game2, g3.dtype AS game3, 
            s.points, s.time_playing, NULL AS user_win
    FROM public.data_game_single s
    INNER JOIN games g1 ON s.id_data_game1 = CAST(g1.id AS TEXT) 
    INNER JOIN games g2 ON s.id_data_game2 = CAST(g2.id AS TEXT) 
    INNER JOIN games g3 ON s.id_data_game3 = CAST(g3.id AS TEXT)
    WHERE id_user = :userId
    """, nativeQuery = true)
    List<Object[]> findIndividualGamesOfPlayer(@Param("userId") String userId);

    @Query(value = """
        SELECT s.id AS id_game, u.username AS user, NULL AS user2, NULL AS userWin, 
               g1.dtype AS game1, g2.dtype AS game2, g3.dtype AS game3, 
               s.is_finish, s.points, s.time_playing
        FROM data_game_single s
        INNER JOIN games g1 ON s.id_data_game1 = CAST(g1.id AS TEXT) 
        INNER JOIN games g2 ON s.id_data_game2 = CAST(g2.id AS TEXT) 
        INNER JOIN games g3 ON s.id_data_game3 = CAST(g3.id AS TEXT)
        INNER JOIN users u ON CAST(u.id AS TEXT) = s.id_user
        WHERE u.status NOT IN ('BLOCKED', 'DELETED')
        """, nativeQuery = true)
    List<Object[]> findAllSingleGames();

    @Query(value = """
            SELECT u.username, SUM(s.points) AS points
            FROM data_game_single s
            INNER JOIN users u ON s.id_user = CAST(u.id AS TEXT) 
            WHERE s.is_finish = true
            GROUP BY u.username
            ORDER BY SUM(points) DESC 
            """, nativeQuery = true)
    List<Object[]> getRankingPuntajeSingle();

    @Query(value = """
            SELECT u.username, SUM(time_playing) time_playing
            FROM data_game_single s
            INNER JOIN users u ON s.id_user = CAST(u.id AS TEXT)
            WHERE is_finish = true 
            GROUP BY u.username
            ORDER BY SUM(time_playing)
            """, nativeQuery = true)
    List<Object[]> getRankingMenorTiempoSingle();


    @Query(value = """
        SELECT * FROM data_game_single WHERE id = :idGame
        """, nativeQuery = true)
    DataGameSingle getResumeGame(@Param("idGame") String idGame);
}
