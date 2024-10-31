package tec.proyecto.guessdastuff.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
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
}
