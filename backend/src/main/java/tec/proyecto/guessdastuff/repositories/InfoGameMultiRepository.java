package tec.proyecto.guessdastuff.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import tec.proyecto.guessdastuff.entities.InfoGameMulti;

@Repository
public interface InfoGameMultiRepository extends JpaRepository<InfoGameMulti, String> {
    @Modifying
    @Transactional
    @Query("UPDATE InfoGameMulti d SET d.isFinish = true, d.idUserWin = ?2, d.points = ?3, d.timePlaying = ?4 WHERE d.id = ?1")
    void updateDataGame(String idGameMulti, String idUserWin, int points, float timePlaying);

}
