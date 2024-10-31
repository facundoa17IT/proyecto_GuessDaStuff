package tec.proyecto.guessdastuff.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tec.proyecto.guessdastuff.entities.GameMode;

@Repository
public interface GameModeRepository extends JpaRepository<GameMode, Long>{

    Optional<GameMode> findByName(String name); // {{ edit_1 }}

}

