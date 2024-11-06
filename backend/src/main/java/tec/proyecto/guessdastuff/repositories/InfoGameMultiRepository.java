package tec.proyecto.guessdastuff.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tec.proyecto.guessdastuff.entities.InfoGameMulti;

@Repository
public interface InfoGameMultiRepository extends JpaRepository<InfoGameMulti, String> {

}
