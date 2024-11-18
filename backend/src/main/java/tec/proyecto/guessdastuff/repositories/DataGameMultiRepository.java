package tec.proyecto.guessdastuff.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import tec.proyecto.guessdastuff.entities.DataGameMulti;

@Repository
public interface DataGameMultiRepository extends JpaRepository<DataGameMulti, String> {

    @Modifying
    @Transactional
    @Query("UPDATE DataGameMulti d SET d.isFinish = true, d.idUserWin = '0' WHERE d.id = ?1")
    void finishPlayGame(String idGameMulti);
    

    @Query(value = """
        WITH GameRows AS (
            SELECT 
                i.id AS id_info_game_multi,
                g.dtype AS game_type,
                ROW_NUMBER() OVER (PARTITION BY i.id ORDER BY g.id) AS row_number
            FROM info_game_multi i
            INNER JOIN games g ON CAST(g.id AS TEXT) = i.id_data_game
        ),
        MultiplayerData AS (
            SELECT 
                m.id AS id_game,
                MAX(CASE WHEN gr.row_number = 1 THEN gr.game_type END) AS game1,
                MAX(CASE WHEN gr.row_number = 2 THEN gr.game_type END) AS game2,
                MAX(CASE WHEN gr.row_number = 3 THEN gr.game_type END) AS game3,
                i.points,
                SUM(i.time_playing) time_playing,
                (SELECT u.username FROM users u WHERE u.id::TEXT = m.id_user_win) AS user_win
            FROM data_game_multi m
            INNER JOIN info_game_multi i ON m.id_info_game_multi = i.id
            INNER JOIN GameRows gr ON gr.id_info_game_multi = i.id
            WHERE m.id_user1 = :userId OR m.id_user2 = :userId
            GROUP BY 
                m.id, i.id, i.points, m.id_user_win
        )
        SELECT * FROM MultiplayerData
        """, nativeQuery = true)
    List<Object[]> findMultiplayerGamesOfPlayer(@Param("userId") String userId);


    @Query(value = """
        WITH GameRows AS (
            SELECT i.id AS id_info_game_multi, g.dtype AS game_type, 
                   ROW_NUMBER() OVER (PARTITION BY i.id ORDER BY g.id) AS row_number
            FROM info_game_multi i
            INNER JOIN games g ON CAST(g.id AS TEXT) = i.id_data_game
        ),
        MultiplayerData AS (
            SELECT m.id AS id_game, u1.username AS user, u2.username AS user2, 
                   uWin.username AS userWin, 
                   MAX(CASE WHEN gr.row_number = 1 THEN gr.game_type END) AS game1,
                   MAX(CASE WHEN gr.row_number = 2 THEN gr.game_type END) AS game2,
                   MAX(CASE WHEN gr.row_number = 3 THEN gr.game_type END) AS game3,
                   m.is_finish, i.points, i.time_playing
            FROM data_game_multi m
            INNER JOIN info_game_multi i ON m.id_info_game_multi = i.id
            INNER JOIN GameRows gr ON gr.id_info_game_multi = i.id
            LEFT JOIN users u1 ON CAST(u1.id AS TEXT) = m.id_user1
            LEFT JOIN users u2 ON CAST(u2.id AS TEXT) = m.id_user2
            LEFT JOIN users uWin ON CAST(uWin.id AS TEXT) = m.id_user_win
            WHERE (u1.status NOT IN ('BLOCKED', 'DELETED') OR u2.status NOT IN ('BLOCKED', 'DELETED'))
            GROUP BY m.id, i.id, i.points, i.time_playing, m.id_user_win, u1.username, u2.username, uWin.username
        )
        SELECT * FROM MultiplayerData
        """, nativeQuery = true)
    List<Object[]> findAllMultiplayerGames();


    @Query(value = """
            SELECT u.username, COUNT(*) AS partidas_win 
            FROM data_game_multi m
            INNER JOIN users u ON m.id_user_win = CAST(u.id AS TEXT)
            GROUP BY u.id, u.username
            ORDER BY partidas_win DESC
            """, nativeQuery = true)
    List<Object[]> getRankingPartidasGanadas();


    @Query(value = """
            SELECT u.username, SUM(i.points) AS points 
            FROM info_game_multi i
            INNER JOIN users u ON i.id_user_win = CAST(u.id AS TEXT) 
            WHERE i.is_finish = true
            GROUP BY u.username
            ORDER BY SUM(points) DESC
            """,nativeQuery = true)
    List<Object[]> getRankingPuntaje();

    @Query(value = """
            SELECT u.username, SUM(time_playing) AS time_playing 
            FROM info_game_multi i
            INNER JOIN users u ON i.id_user_win = CAST(u.id AS TEXT)
            WHERE i.is_finish = true
            GROUP BY  u.username
            ORDER BY SUM(time_playing)
            """, nativeQuery = true)
    List<Object[]> getRankingMenorTiempoMulti();



    
}
