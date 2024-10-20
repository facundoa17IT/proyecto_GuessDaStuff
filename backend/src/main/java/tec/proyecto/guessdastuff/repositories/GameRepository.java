package tec.proyecto.guessdastuff.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tec.proyecto.guessdastuff.entities.Game;

@Repository
public interface GameRepository extends JpaRepository<Game, Long>{

    
} 