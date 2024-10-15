package tec.proyecto.guessdastuff.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import tec.proyecto.guessdastuff.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String nombre);
}