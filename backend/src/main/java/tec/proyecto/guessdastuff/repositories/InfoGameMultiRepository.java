package tec.proyecto.guessdastuff.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import tec.proyecto.guessdastuff.entities.InfoGameMulti;
import tec.proyecto.guessdastuff.entities.InfoGameMultiId;

@Repository
public interface InfoGameMultiRepository extends JpaRepository<InfoGameMulti, InfoGameMultiId> {

    @Modifying
    @Transactional
    @Query("UPDATE InfoGameMulti d SET d.isFinish = true, d.idUserWin = :idUserWin, d.points = :points, d.timePlaying = :timePlaying " +
        "WHERE d.infoGameMultiId.id = :infoGameMultiId AND d.infoGameMultiId.idDataGame = :idDataGame")
    void updateDataGame(@Param("infoGameMultiId") String infoGameMultiId, 
                        @Param("idDataGame") String idDataGame,  
                        @Param("idUserWin") String idUserWin,  
                        @Param("points") int points, 
                        @Param("timePlaying") float timePlaying);


    @Modifying
    @Transactional
    @Query("UPDATE InfoGameMulti d SET d.isFinish = true, d.points = 0, d.timePlaying = 30, d.idUserWin = '0' WHERE d.infoGameMultiId.id = :infoGameMultiId AND d.infoGameMultiId.idDataGame = :idDataGame")
    void finishGameMulti(@Param("infoGameMultiId") String infoGameMultiId, @Param("idDataGame") String idDataGame);

    @Query(value = """
    SELECT * FROM info_game_multi WHERE id = :idInfo LIMIT 3
    """, nativeQuery = true)
    List<InfoGameMulti> getInfoGameById(@Param("idInfo") String idInfo);
}
