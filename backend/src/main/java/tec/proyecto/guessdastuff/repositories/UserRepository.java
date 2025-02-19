package tec.proyecto.guessdastuff.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tec.proyecto.guessdastuff.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String nombre);

    Optional<User> findByEmail(String email);
    
    Optional<User> findByResetToken(String resetToken);

}