package tec.proyecto.guessdastuff.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import tec.proyecto.guessdastuff.entities.DataGameMulti;

@Repository
public interface DataGameMultiRepository extends JpaRepository<DataGameMulti, String> {

    @Modifying
    @Transactional
    @Query("UPDATE DataGameMulti d SET d.isFinish = true, d.idUserWin = ?1 WHERE d.id = ?2")
    void finishPlayGame(String idUserWin,String idGameMulti);
}
