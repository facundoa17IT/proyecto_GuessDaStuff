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
    @Query("UPDATE InfoGameMulti d SET d.isFinish = true, d.idUserWin = ?2, d.points = ?3, d.timePlaying = ?4 WHERE d.infoGameMultiId = ?1")
    void updateDataGame(InfoGameMultiId infoGameMultiId, String idUserWin, int points, float timePlaying);

    @Modifying
    @Transactional
    @Query("UPDATE InfoGameMulti d SET d.isFinish = true, d.points = 0, d.timePlaying = 30 WHERE d.infoGameMultiId.id = ?1")
    void finishGameMulti(InfoGameMultiId infoGameMultiId);

    @Query(value = """
    SELECT * FROM info_game_multi WHERE id = :idInfo LIMIT 3
    """, nativeQuery = true)
    List<InfoGameMulti> getInfoGameById(@Param("idInfo") String idInfo);
}
